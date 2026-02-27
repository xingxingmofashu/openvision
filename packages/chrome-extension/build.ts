import { copy, remove } from 'fs-extra'

const outdir = "./dist"

await remove(outdir)
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir,
})

// Copy static assets
await copy("./public", outdir)

// Generate manifest.json
type IconSize = "16" | "24" | "32" | "48" | "128"
interface ManifestConfig {
  manifest_version: 3
  name: string
  version: string
  description: string
  icons: Partial<Record<IconSize, string>>
  action?: {
    default_icon?: Partial<Record<IconSize, string>>
    default_title?: string
    default_popup?: string
  }
}

async function generateManifestConfig(config: ManifestConfig) {
  await Bun.write(`${outdir}/manifest.json`, JSON.stringify(config, null, 2))
}

await generateManifestConfig({
  "name": "OpenVision",
  "description": "Base Level Extension",
  "version": "0.1",
  "manifest_version": 3,
  "icons": {
    "128": "/images/openvision.png",
  }
})

