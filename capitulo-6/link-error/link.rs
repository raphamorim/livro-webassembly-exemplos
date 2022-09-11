// rustc link.rs --target wasm32-unknown-unknown --crate-type=cdylib 

// Se preferir otimizado: rustc link.rs -C lto -O --target wasm32-unknown-unknown --crate-type=cdylib 
// Você também pode especificar como: extern "C"
extern {
    // fn ola(f: extern "C" fn(u32) -> u32);
    #[link_name = "console_log"]
    fn log(x: f64) -> f64;
}

#[no_mangle]
pub extern fn soma_ate_n(n: f64) -> f64 {
    unsafe {
        log(n);
    }
    (n * (n + 1.)) / 2.
}

// #[no_mangle]
// pub fn run() {
//     extern "C" fn plus_one(x: u32) -> u32 {
//         x + 1
//     }

//     unsafe {
//         ola(plus_one);
//     }
// }

