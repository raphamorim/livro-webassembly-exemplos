static DEZ: i32 = 10;
#[export_name = "retorna_dez"]
pub extern fn retorna_10() -> i32 {
    DEZ
}

#[no_mangle]
pub extern fn quadrado(x: i32) -> i32 {
    x * x
}