(module
  (func (export "soma") (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.add
    return
  )
  (func (export "subtracao") (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.sub
    return
  )
  (func (export "divisao") (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.div_u
    return
  )
  (func (export "multiplicacao") (param $lhs i32) (param $rhs i32) (result i32)
    local.get $lhs
    local.get $rhs
    i32.mul
    return
  ))