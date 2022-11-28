use core::slice::from_raw_parts_mut;

#[no_mangle]
fn soma(valor: u8) -> u8 {
    let parte: &mut [u8] = unsafe { from_raw_parts_mut(1 as *mut u8, 255) };
    parte[0] = parte[0] + valor;
    parte[0]
}