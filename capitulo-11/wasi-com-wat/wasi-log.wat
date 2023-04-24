(module
	(func $fd_write (import "wasi_unstable" "fd_write")
		(param $fd i32)
		(param $iovs i32)
		(param $iovs_len i32)
		(param $nwritten i32)
		(result i32))

	(memory 1)
    (export "memory" (memory 0))

    (data (i32.const 8) "> Olá!\n")
    (data (i32.const 16) "> Está tudo bem?\n")

    (func $main (export "_start")
        
        (i32.store (i32.const 0) (i32.const 8))  
        (i32.store (i32.const 4) (i32.const 26)) 

        (call $fd_write
            (i32.const 1) 
            (i32.const 0) 
            (i32.const 1) 
            (i32.const 28) 
        )
        drop
    )
)

