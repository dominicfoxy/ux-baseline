/// Tests whether a TCP connection can be established to the host:port derived
/// from `url`. Used by the frontend connection-status pattern demo.
#[tauri::command]
fn test_connection(url: String) -> bool {
    use std::net::{TcpStream, ToSocketAddrs};
    use std::time::Duration;

    let stripped = url
        .trim_start_matches("https://")
        .trim_start_matches("http://");
    let host_port = stripped.split('/').next().unwrap_or(stripped);

    let (host, port) = if let Some(idx) = host_port.rfind(':') {
        let port: u16 = host_port[idx + 1..].parse().unwrap_or(80);
        (&host_port[..idx], port)
    } else {
        (host_port, 80u16)
    };

    let addr_str = format!("{}:{}", host, port);
    match addr_str.to_socket_addrs() {
        Ok(mut addrs) => addrs.next().map_or(false, |addr| {
            TcpStream::connect_timeout(&addr, Duration::from_secs(3)).is_ok()
        }),
        Err(_) => false,
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![test_connection])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
