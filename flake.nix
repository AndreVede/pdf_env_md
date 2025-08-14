{
  description = "A node + bun env";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }@inputs: let
    system = "x86_64-linux";

    pkgs = import nixpkgs {
      inherit system;

      config = {
        allowUnfree = false;
      };
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      shellHook = ''
        export PUPPETEER_EXECUTABLE_PATH=${pkgs.chromium}/bin/chromium
        bun i
      '';

      # make sure dependencies are linked
      nativeBuildInputs = [ pkgs.pkg-config ];

      buildInputs = with pkgs; [
        bun
        nodejs_22
        chromium
        glib
        nss         # pour TLS
        cacert      # certificats racines
      ];
    };
  };
}
