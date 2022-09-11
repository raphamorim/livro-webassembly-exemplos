// rustc link.rs --target wasm32-unknown-unknown --crate-type=cdylib 

// Se preferir otimizado: rustc link.rs -C lto -O --target wasm32-unknown-unknown --crate-type=cdylib 
// Você também pode especificar como: extern "C"
extern "C" {
    fn ola(f: extern "C" fn(u32) -> u32);
}

#[no_mangle]
pub fn run() {
    extern "C" fn plus_one(x: u32) -> u32 {
        x + 1
    }

    unsafe {
        ola(plus_one);
    }
}

