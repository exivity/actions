# Retag Image

A secure GitHub Action that retags container images while preserving signatures
and attestations using cosign.

## Features

- 🔒 **Automatic attestation preservation** using cosign
- 🏗️ **Multi-arch support** with proper manifest handling
- ⚡ **One-step setup** - no manual cosign installation needed
- 🛡️ **Secure cosign installation** with pinned, verified releases
- 🔄 **Graceful fallback** to docker buildx if cosign fails

## Quick Start

```yaml
- name: Retag image with attestations
  uses: ./retag-image
  with:
    source-tag: main
    target-tag: v1.2.3
    target-password: ${{ secrets.DOCKERHUB_TOKEN }}
```

That's it! The action will automatically:

1. Install cosign securely
2. Copy your image with all signatures and attestations
3. Verify the copy succeeded

## Inputs

### Source Image

| Input              | Description                  | Required | Default               |
| ------------------ | ---------------------------- | -------- | --------------------- |
| `source-registry`  | Source image registry        | ✅       | `ghcr.io`             |
| `source-namespace` | Source image namespace       | ❌       | Repository owner      |
| `source-name`      | Source image name            | ❌       | Repository name       |
| `source-tag`       | Source image tag             | ✅       | -                     |
| `source-user`      | Username for source registry | ❌       | `${{ github.actor }}` |
| `source-password`  | Password for source registry | ❌       | `${{ github.token }}` |

### Target Image

| Input              | Description                  | Required | Default          |
| ------------------ | ---------------------------- | -------- | ---------------- |
| `target-registry`  | Target image registry        | ✅       | `docker.io`      |
| `target-namespace` | Target image namespace       | ❌       | Repository owner |
| `target-name`      | Target image name            | ❌       | Repository name  |
| `target-tag`       | Target image tag             | ✅       | -                |
| `target-user`      | Username for target registry | ❌       | -                |
| `target-password`  | Password for target registry | ❌       | -                |

### Configuration

| Input                   | Description                      | Required | Default  |
| ----------------------- | -------------------------------- | -------- | -------- |
| `multi-arch`            | Enable multi-arch support        | ❌       | `true`   |
| `preserve-attestations` | Preserve signatures/attestations | ❌       | `true`   |
| `cosign-version`        | Version of cosign to install     | ❌       | `v2.4.1` |

## Examples

### Basic Usage

```yaml
- name: Retag latest to release
  uses: ./retag-image
  with:
    source-tag: latest
    target-tag: v1.0.0
    target-password: ${{ secrets.DOCKERHUB_TOKEN }}
```

### Cross-Registry with Custom Namespaces

```yaml
- name: Promote to production registry
  uses: ./retag-image
  with:
    source-registry: ghcr.io
    source-namespace: myorg
    source-name: myapp
    source-tag: staging-v1.2.3
    target-registry: registry.company.com
    target-namespace: production
    target-name: myapp
    target-tag: v1.2.3
    source-password: ${{ secrets.GITHUB_TOKEN }}
    target-user: ${{ secrets.PROD_REGISTRY_USER }}
    target-password: ${{ secrets.PROD_REGISTRY_TOKEN }}
```

### Without Attestations (Faster)

```yaml
- name: Simple retag without security features
  uses: ./retag-image
  with:
    source-tag: main
    target-tag: latest
    preserve-attestations: 'false' # Skip cosign, use docker buildx only
```

### Custom Cosign Version

```yaml
- name: Retag with specific cosign version
  uses: ./retag-image
  with:
    source-tag: main
    target-tag: v1.0.0
    cosign-version: 'v2.3.0' # Use specific cosign version
    target-password: ${{ secrets.DOCKERHUB_TOKEN }}
```

## Security Features

- **Verified cosign installation**: Uses official `sigstore/cosign-installer@v3`
- **Pinned versions**: Cosign version is pinned for reproducible builds
- **Attestation preservation**: Signatures, SBOMs, and provenance data are
  preserved
- **Multi-arch support**: Handles complex multi-platform images correctly

## Troubleshooting

### Attestations Not Preserved

If attestations aren't being copied:

1. Ensure `preserve-attestations: 'true'` (default)
2. Check that source image has attestations: `cosign tree ghcr.io/org/image:tag`
3. Verify registry supports OCI Referrers API

### Permission Errors

Ensure your tokens have appropriate permissions:

- Source registry: `packages:read`
- Target registry: `packages:write` or equivalent

### Multi-arch Issues

If you see manifest errors:

- Ensure source image is actually multi-arch
- Try setting `multi-arch: 'false'` for single-arch images

## Comparison with retag-image-basic

| Feature                  | retag-image    | retag-image-basic |
| ------------------------ | -------------- | ----------------- |
| Multi-arch support       | ✅             | ✅                |
| Attestation preservation | ✅ (automatic) | ⚠️ (manual setup) |
| Cosign installation      | ✅ (automatic) | ❌ (manual)       |
| Security verification    | ✅             | ❌                |
| Ease of use              | ✅ Excellent   | ⚠️ Good           |
| Setup complexity         | Simple         | More complex      |

**Use `retag-image`** (this action) for production workloads where security
attestations matter. **Use `retag-image-basic`** if you need more control over
the cosign installation process.
