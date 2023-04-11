use core::slice::from_raw_parts_mut;
use std::alloc::{alloc, Layout};
use std::mem;

#[no_mangle]
extern fn criar_memoria_inicial() {
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
extern fn ponteiro_usando_box() -> *const [u8; 4] {
    Box::into_raw(Box::new([8,5,8,5]))
}

#[no_mangle]
extern fn ponteiro() -> *const u8 {
    [8,5,8,5].as_ptr()
}

#[no_mangle]
fn sem_ponteiro() -> [u8; 4] {
    [8,5,8,5]
}

#[no_mangle]
extern fn malloc(comprimento: usize) -> *mut u8 {
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
extern fn acumular(pointeiro: *mut u8, comprimento: usize) -> i32 {
    let fatia = unsafe { from_raw_parts_mut(pointeiro as *mut u8, comprimento) };
    let mut soma = 0;
    for i in 0..comprimento {
        soma = soma + fatia[i];
    }
    soma as i32
}

#[no_mangle]
extern fn filtro_preto_e_branco(pointeiro: *mut u8, comprimento: usize) {
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

#[no_mangle]
extern fn filtro_vermelho(data: *mut u8, len: usize) {
    let pixels = unsafe { from_raw_parts_mut(data as *mut u8, len) };
    let mut i = 0;
    loop {
        if i >= len - 1 {
            break;
        }

        // 0
        pixels[i + 1] = pixels[i + 1] / 2;
        pixels[i + 2] = pixels[i + 2] / 2;
        // 3
        // 4
        pixels[i + 5] = pixels[i + 5] / 2;
        pixels[i + 6] = pixels[i + 6] / 2;
        // 7
        i += 8;
    }
}

#[no_mangle]
extern fn filtro_verde(data: *mut u8, len: usize) {
    let pixels = unsafe { from_raw_parts_mut(data as *mut u8, len) };
    let mut i = 0;
    loop {
        if i >= len - 1 {
            break;
        }

        pixels[i] = pixels[i] / 2;
        // 1
        pixels[i + 2] = pixels[i + 2] / 2;
        // 3
        pixels[i + 4] = pixels[i + 4] / 2;
        // 5
        pixels[i + 6] = pixels[i + 6] / 2;
        // 7
        i += 8;
    }
}

#[no_mangle]
extern fn filtro_azul(data: *mut u8, len: usize) {
    let pixels = unsafe { from_raw_parts_mut(data as *mut u8, len) };
    let mut i = 0;
    loop {
        if i >= len - 1 {
            break;
        }

        pixels[i] = pixels[i] / 2;
        pixels[i + 1] = pixels[i + 1] / 2;
        // 2
        // 3
        pixels[i + 4] = pixels[i + 4] / 2;
        pixels[i + 5] = pixels[i + 5] / 2;
        // 6
        // 7
        i += 8;
    }
}

#[no_mangle]
extern fn filtro_super_azul(data: *mut u8, len: usize) {
    let pixels = unsafe {
        from_raw_parts_mut(data as *mut u8, len)
    };
    let mut i = 0;
    loop {
        if i >= len - 1 {
            break;
        }

        pixels[i] = 0;
        pixels[i + 1] = 0;
        // 2
        // 3
        pixels[i + 4] = 0;
        pixels[i + 5] = 0;
        // 6
        // 7
        i += 8;
    }
}

#[no_mangle]
extern fn filtro_inversao(data: *mut u8, len: usize) {
    let pixels = unsafe { from_raw_parts_mut(data as *mut u8, len) };
    for i in (0..len - 1).step_by(4) {
        pixels[i] = 255 - pixels[i];
        pixels[i + 1] = 255 - pixels[i + 1];
        pixels[i + 2] = 255 - pixels[i + 2];        
    }
}

#[no_mangle]
extern fn filtro_sepia(data: *mut u8, len: usize) {
    let pixels = unsafe {
        from_raw_parts_mut(data as *mut u8, len)
    };

    let mut i = 0;
    loop {
        if i >= len - 1 {
            break;
        }

        let r = pixels[i] as f32;
        let g = pixels[i + 1] as f32;
        let b = pixels[i + 2] as f32;

        pixels[i] =
            ((r * 0.393) + (g * 0.769) + (b * 0.189)) as u8;
        pixels[i + 1] =
            ((r * 0.349) + (g * 0.686) + (b * 0.168)) as u8;
        pixels[i + 2] =
            ((r * 0.272) + (g * 0.534) + (b * 0.131)) as u8;

        i += 4;
    }
}

#[no_mangle]
extern fn novo_filtro_sepia(data: *mut u8, len: usize) {
    let pixels = unsafe { from_raw_parts_mut(data as *mut u8, len) };
    for i in (0..len - 1).step_by(4) {
        let r = pixels[i] as f32;
        let g = pixels[i + 1] as f32;
        let b = pixels[i + 2] as f32;

        let media = 0.3 * r + 0.59 * g + 0.11 * b;
        let novo_azul = if media + 100.0 < 255.0 {
            media as u8 + 100
        } else {
            255
        };
        let novo_verde = if media + 50.0 < 255.0 {
            media as u8 + 50
        } else {
            255
        };

        pixels[i] = novo_azul;
        pixels[i + 1] = novo_verde;
        pixels[i + 2] = media as u8;
    }
}

#[no_mangle]
extern fn filtro_opacidade(data: *mut u8, len: usize) {
    let pixels = unsafe { from_raw_parts_mut(data as *mut u8, len) };
    let mut i = 0;
    let alfa = 10;
    loop {
        if i >= len - 1 {
            break;
        }

        let valor_atual = pixels[i + 3];
        if valor_atual >= alfa {
            pixels[i + 3] = valor_atual - alfa;
        } else {
            pixels[i + 3] = 0;
        };
        
        i += 4;
    }
}