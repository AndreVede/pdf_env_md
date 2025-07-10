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
        bun i
        bun x puppeteer install chrome@latest
      '';

      buildInputs = with pkgs; [
        bun
        nodejs_22
      ];
    };
  };
}
