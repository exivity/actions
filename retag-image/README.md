# Retag Image Basic

A low-level GitHub Action for retagging container images with multi-arch
support.

## When to Use This Action

Use `retag-image-basic` when you need:

- **Manual control** over cosign installation
- **Custom attestation handling** logic
- **Integration** with existing cosign workflows
- **Minimal dependencies** in your action

For most users, we recommend using the main `retag-image` action instead, which
automatically handles cosign installation and attestation preservation.

## Features

- 🏗️ **Multi-arch support** with Docker buildx
- 🔄 **Graceful fallback** for attestation issues
- ⚙️ **Manual cosign control** (you install it)
- 🎛️ **Configurable** attestation handling

## Usage

### With Manual Cosign Installation (Recommended)

```yaml
- name: Install cosign
  uses: sigstore/cosign-installer@v3
  with:
    cosign-release: 'v2.4.1'

- name: Retag image
  uses: ./retag-image-basic
  with:
    source-tag: main
    target-tag: v1.0.0
    preserve-attestations: 'true'
    target-password: ${{ secrets.DOCKERHUB_TOKEN }}
```

### Without Attestations (Simpler)

```yaml
- name: Basic retag
  uses: ./retag-image-basic
  with:
    source-tag: main
    target-tag: latest
    preserve-attestations: 'false'
    target-password: ${{ secrets.DOCKERHUB_TOKEN }}
```

## Inputs

Same as the main `retag-image` action, but **you must install cosign manually**
if you want `preserve-attestations: 'true'` to work properly.

| Input                   | Description                  | Required | Default          |
| ----------------------- | ---------------------------- | -------- | ---------------- |
| `source-registry`       | Source image registry        | ✅       | `ghcr.io`        |
| `source-namespace`      | Source image namespace       | ❌       | Repository owner |
| `source-name`           | Source image name            | ❌       | Repository name  |
| `source-tag`            | Source image tag             | ✅       | -                |
| `target-registry`       | Target image registry        | ✅       | `docker.io`      |
| `target-namespace`      | Target image namespace       | ❌       | Repository owner |
| `target-name`           | Target image name            | ❌       | Repository name  |
| `target-tag`            | Target image tag             | ✅       | -                |
| `multi-arch`            | Enable multi-arch support    | ❌       | `true`           |
| `preserve-attestations` | Try to preserve attestations | ❌       | `true`           |

## Comparison

| Feature                  | retag-image    | retag-image-basic   |
| ------------------------ | -------------- | ------------------- |
| Cosign installation      | ✅ Automatic   | ❌ Manual           |
| Ease of use              | ✅ Simple      | ⚠️ More setup       |
| Attestation preservation | ✅ Reliable    | ⚠️ Depends on setup |
| Advanced control         | ❌ Opinionated | ✅ Flexible         |
| Dependencies             | More           | Fewer               |

## When to Use Each

### Use `retag-image` (main action) when:

- ✅ You want attestations preserved automatically
- ✅ You prefer simple, one-step setup
- ✅ You're building production workflows
- ✅ You want the latest security best practices

### Use `retag-image-basic` when:

- ✅ You need custom cosign configuration
- ✅ You're integrating with existing signing workflows
- ✅ You want minimal action dependencies
- ✅ You need fine-grained control over the process

## Migration

If you're currently using this action, consider migrating to the main
`retag-image` action:

**Before:**

```yaml
- uses: sigstore/cosign-installer@v3
  with:
    cosign-release: 'v2.4.1'
- uses: ./retag-image-basic
  with: # ... inputs
```

**After:**

```yaml
- uses: ./retag-image
  with: # ... same inputs
```

The main action provides the same functionality with better defaults and
automatic setup.
