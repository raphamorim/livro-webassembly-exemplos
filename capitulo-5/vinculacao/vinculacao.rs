// rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib 

extern "C" {
    #[link_name = "console_log"]
    fn log(x: i32) -> i32;

    #[link_name = "alert"]
    fn alert(x: i32) -> i32;
}

#[link(name = "quadrado")]
extern "C" {
    fn quadrado(x: i32) -> i32;
}

#[no_mangle]
pub fn executar() {
    unsafe {
        log(20); // 20
        log(87654321); // 87654321

        alert(quadrado(85)); // 85 com window.alert
    }
}
