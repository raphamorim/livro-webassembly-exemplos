use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn texto() -> String {
    String::from("Bem-vindo ao fantástico mundo do WebAssembly.")
}