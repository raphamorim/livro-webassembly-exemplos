use std::fs::File;
use std::io::prelude::*;

#[no_mangle]
pub extern fn soma_aliquota(numero: u64) -> u64 {
    if numero == 1 || numero == 0 {
        return 0;
    }
    let mut soma: u64 = 0;
    for i in 1..(numero / 2 + 1) {
        if numero % i == 0 {
            soma += i;
        }
    }
    soma
}

fn main() -> std::io::Result<()> {
    let mut file = File::create("/resultado/arquivo.txt")?;
    file.write_all(b"Resultado da soma_aliquota de 15: ")?;
    file.write_all(soma_aliquota(15).to_string().as_bytes())?;
    file.write_all(b"\n")?;
    file.write_all(b"Resultado da soma_aliquota de 85: ")?;
    file.write_all(soma_aliquota(85).to_string().as_bytes())?;
    Ok(())
}