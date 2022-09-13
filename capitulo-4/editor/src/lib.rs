use core::slice::from_raw_parts_mut;
use std::alloc::{alloc, Layout};
use std::mem;

#[no_mangle]
pub fn criar_memoria_inicial() {
    let fatia: &mut [u8];

    unsafe {
        fatia = from_raw_parts_mut::<u8>(5 as *mut u8, 10);
    }

    fatia[0] = 85;
}

#[no_mangle]
pub fn subtracao(numero_a: u8, numero_b: u8) -> u8 {
    numero_a - numero_b
}

#[no_mangle]
pub fn malloc(comprimento: usize) -> *mut u8 {
    let alinhamento = mem::align_of::<usize>();
    if let Ok(layout) = Layout::from_size_align(comprimento, alinhamento) {
        unsafe {
            if layout.size() > 0 {
                let ponteiro = alloc(layout);
                if !ponteiro.is_null() {
                    return ponteiro;
                }
            } else {
                return alinhamento as *mut u8;
            }
        }
    }
    std::process::abort()
}

#[no_mangle]
pub fn acumular(pointeiro: *mut u8, comprimento: usize) -> i32 {
    let fatia = unsafe { from_raw_parts_mut(pointeiro as *mut u8, comprimento) };
    let mut soma = 0;
    for i in 0..comprimento {
        soma = soma + fatia[i];
    }
    soma as i32
}

#[no_mangle]
pub fn filtro_preto_e_branco(pointeiro: *mut u8, comprimento: usize) {
    let pixels = unsafe { from_raw_parts_mut(pointeiro as *mut u8, comprimento) };
    let mut i = 0;
    loop {
        if i >= comprimento - 1 {
            break;
        }
        let filtro = (pixels[i] / 3) + (pixels[i + 1] / 3) + (pixels[i + 2] / 3);
        pixels[i] = filtro;
        pixels[i + 1] = filtro;
        pixels[i + 2] = filtro;
        i += 4;
    }
}