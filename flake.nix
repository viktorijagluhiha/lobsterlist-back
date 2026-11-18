{
  description = "Node.js development environment for lobsterlist-back";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
    in
    {
      devShells = nixpkgs.lib.genAttrs systems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default =
            assert pkgs.lib.versionAtLeast pkgs.nodejs_24.version "24.15.0";
            pkgs.mkShellNoCC {
              name = "lobsterlist-back";
              packages = [
                pkgs.nodejs_24
                pkgs.openssl
              ];
            };
        });
    };
}
