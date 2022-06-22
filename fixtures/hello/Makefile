compile:
	cargo build --release
	cargo build --target=x86_64-pc-windows-gnu --release
	strip target/release/hello
	strip target/x86_64-pc-windows-gnu/release/hello.exe
	cp target/release/hello build
	cp target/x86_64-pc-windows-gnu/release/hello.exe build