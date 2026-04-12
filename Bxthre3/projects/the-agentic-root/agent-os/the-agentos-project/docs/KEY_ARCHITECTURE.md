# Sovereign Federation — Key Architecture

## Two Operating Modes

### Mode A: Android Root (Default)
| Aspect | Detail |
|--------|--------|
| Root Key | Stored in Android Secure Enclave |
| Authorization | Android signs directly, nodes verify |
| Fallback | None — if Android offline, queue until back |
| Use | Daily operations when you trust your phone |

### Mode B: Threshold Root (Distributed)
| Aspect | Detail |
|--------|--------|
| Scheme | 2-of-3 Shamir Secret Sharing |
| Shard 1 | Android Secure Enclave |
| Shard 2 | Zo Backend (`PASSWORD` secret) |
| Shard 3 | Render Worker (runtime-only) |
| Authorization | Any 2 shards combine to sign |
| Use | Android lost, distributed trust, redundancy |

---

## Mode Switching

```kotlin
// Android decides which mode
if (androidHasFullKey && userPrefersLocal) {
    mode = ANDROID_ROOT  // Sign locally, broadcast signed commands
} else {
    mode = THRESHOLD_ROOT  // Participate as 1-of-3 signer
}
```

---

## Task Signing Flow (Mode A)

```
[You] → [Android Secure Enclave] → [Signed Task] → [Broadcast to Mesh]
                                      ↑
                                Full root key
```

## Task Signing Flow (Mode B)

```
[You] → [Android Shard 1] ──┐
                            ├──→ [Zo Control Plane combines 2-of-3] → [Signed Task]
[Zo Shard 2] ─────────────┘
```

---

## Shard Recovery

| Lost Shard | Recovery Path |
|------------|---------------|
| Android | Use Zo + Render shards (Mode B) → reconstitute → split new Android shard |
| Zo | Use Android + Render → reconstitute → re-import to Zo Secrets |
| Render | Uses Android + Zo → reconstitute → deploy new Render worker with fresh shard |

---

## Security Model

- **Mode A**: Trust Android hardware security, single point = convenience
- **Mode B**: No single compromise leaks key, requires 2-of-3 collusion
- **Shard material**: Never stored together, never transmitted unencrypted
- **Reconstruction**: Only happens at signing time in secure memory
