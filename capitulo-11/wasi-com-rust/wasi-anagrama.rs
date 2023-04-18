#[no_mangle]
fn validar_anagrama(s: &str, t: &str) -> bool {
    let mut s = s.to_ascii_lowercase().chars().collect::<Vec<_>>();
    let mut t = t.to_ascii_lowercase().chars().collect::<Vec<_>>();
    s.sort_unstable();
    t.sort_unstable();
    s == t
}

fn main() {
    println!("{}", validar_anagrama("amor", "ramo"));
    println!("{}", validar_anagrama("mora", "roma"));
    println!("{}", validar_anagrama("marcia", "paulo"));
}
