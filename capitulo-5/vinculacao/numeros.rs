pub static NUMERO: u32 = 87654321;

static VINTE: u8 = 20;

#[allow(dead_code)]
pub extern fn retorna_vinte() -> &'static u8 {
    &VINTE
}