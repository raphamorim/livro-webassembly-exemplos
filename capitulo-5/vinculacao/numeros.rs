pub static NUMERO: u32 = 87654321;

static VINTE: u32 = 20;

pub extern fn retorna_vinte() -> &'static u32 {
    &VINTE
}