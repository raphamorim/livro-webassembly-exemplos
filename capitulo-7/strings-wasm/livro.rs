// rustc livro.rs --target wasm32-unknown-unknown --crate-type=cdylib 

extern crate core;

use std::ptr;
use core::slice::from_raw_parts_mut;

fn meu_livro() -> String {
    // Início do livro Vidas Secas de Graciliano Ramos
    String::from("Na planície avermelhada os juazeiros alargavam duas manchas verdes. Os infelizes tinham caminhado o dia inteiro, estavam
cansados e famintos. Ordinariamente andavam pouco, mas como haviam repousado bastante na areia do rio seco, a viagem
progredira bem três léguas. Fazia horas que procuravam uma sombra. A folhagem dos juazeiros apareceu longe, através dos
galhos pelados da catinga rala.
Arrastaram-se para lá, devagar, sinha Vitória com o filho mais novo escanchado no quarto e o baú de folha na cabeça,
Fabiano sombrio, cambaio, o aió a tiracolo, a cuia pendurada numa correia presa ao cinturão, a espingarda de pederneira no
ombro. O menino mais velho e a cachorra Baleia iam atrás.")
}

#[no_mangle]
pub fn criar_texto_na_memoria() {
    let fatia: &mut [u8];
    let texto: String = meu_livro();
    let null_ptr: *mut u8 = ptr::null_mut();
    let array_bytes: &[u8] = texto.as_bytes();

    unsafe {
        fatia = from_raw_parts_mut::<u8>(
            null_ptr,
            array_bytes.len()
        );
    }

    for pos in 0..array_bytes.len() {
        fatia[pos] = array_bytes[pos];
    }

}