;; Exemplo simples de try_lock, lock e unlock usando i32
;; Este exemplo não está no livro logo é considerado
;; como uma referência de código adicional

(func $try_lock (export "try_lock")
    (param $endreco i32) (result i32)
    ;; Tenta pegar o mutex.
    ;; A operação cmpxchg atomicamente faz o seguinte:
    ;; - Carrega o valor no endereço.
    ;; - Se o valor é 0 (está desbloqueado),
    ;;      coloca o valor como 1 (bloqueado).
    ;; - Retorna o valor carregado inicialmente.
    (i32.atomic.rmw.cmpxchg
    (local.get $endreco)   ;; endereço
    (i32.const 0)          ;; valor experado (0 => desbloqueado)
    (i32.const 1))         ;; valor alterado (1 => bloqueado)

    ;; Se retornar 0, significa que adquirimos o mutex.
    ;; Queremos retornar o inverso (1 significa mutex adquirido)
    (i32.eqz)
)

;; Bloqueia uma mutex no endereço fornecido
;; tentando novamente até obter sucesso.
(func (export "lockMutex")
    (param $endereco i32)
    (block $terminar
      (loop $repetir
        (call $try_lock (local.get $endereco))
        (br_if $terminar)

        (memory.atomic.wait32
          (local.get $endereco)
          (i32.const 1)
          (i64.const -1))

        ;; memory.atomic.wait32 retorna:
        ;;   0 => "ok", acordado por outro.
        ;;   1 => "not-equal", valor carregado != valor esperado diferentes
        ;;   2 => "timed-out", acabou o tempo de espera
        ;;
        ;; Considerando que usamos -1 (infinito), apenas 0 ou 1 poderão retornar.
        (drop)

        ;; Tenta de novo
        (br $repetir))))

;; Desbloqueia a mutex no endereço
(func (export "unlockMutex")
    (param $endereco i32)
    ;; Desbloqueia
    (i32.atomic.store
      (local.get $endereco)  ;; endereço
      (i32.const 0))         ;; 0 => desbloqueado

    ;; Notifica um "ouvinte" que está esperando
    (drop
      (memory.atomic.notify
        (local.get $endereco)   ;; endereço
        (i32.const 1))))        ;; notifica 1 ouvinte