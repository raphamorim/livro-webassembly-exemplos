(module
    (func $fd_write (import "wasi_unstable" "fd_write")
        (param $fd i32)
        (param $iovs i32)
        (param $iovs_len i32)
        (param $nwritten i32)
        (result i32))
    
    ;; 64 KiB
    (memory 1)
    (export "memory" (memory 0))

    (func $exibir
        (param $ponteiro i32)
        (i32.store
            (i32.const 0)
            (local.get $ponteiro))
        (i32.store
            (i32.const 4)
            (call $tamanhoDaString
                (local.get $ponteiro)))
        (call $fd_write
            (i32.const 1)    
            (i32.const 0)    
            (i32.const 1)    
            (i32.const 3000))
        drop)

    (func $tamanhoDaString (param $ponteiro i32) (result i32)
        ;; Define a variável $tamanho e colocar o valor como 0
        (local $tamanho i32)
        (local.set $tamanho
            (i32.const 0))
        ;; Procura pelo final da string, o valor: '\0'.
        ;; Continua adicionando 1 até achar.
        (block $procuraTamanho
            (loop $repeticao
                (br_if $procuraTamanho
                    (i32.eqz
                        (i32.load8_u
                            (i32.add
                                (local.get $ponteiro)
                                (local.get $tamanho)))))
                (local.set $tamanho
                    (i32.add
                        (local.get $tamanho)
                        (i32.const 1)))
                (br $repeticao)))
        ;; Retorna o tamanho
        (local.get $tamanho))

    (data (i32.const 1000) "*\n\00")
    (data (i32.const 1005) "1\n\00")
    (data (i32.const 1010) "2\n\00")
    (data (i32.const 1015) "3\n\00")
    (data (i32.const 1020) "4\n\00")

    (func (export "_start")
        (call $exibir
            (i32.const 1000))
        (call $exibir
            (i32.const 1005))
        (call $exibir
            (i32.const 1010))
        (call $exibir
            (i32.const 1015))
        (call $exibir
            (i32.const 1020))
    )
)