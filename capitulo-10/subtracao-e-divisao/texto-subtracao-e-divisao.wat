(module
 (func $funcao (param i32) (param i32) (param i32) (result i32)
  (i32.sub
  (local.get 0)
    (i32.div_u (local.get 1) (local.get 2)
  ))
)
 (export "funcao" (func $funcao))
)
