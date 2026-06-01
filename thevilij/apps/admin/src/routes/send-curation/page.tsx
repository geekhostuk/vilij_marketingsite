import { useEffect, useState } from "react"
import {
  Container,
  Heading,
  Text,
  Button,
  Badge,
  Table,
  Textarea,
  Switch,
  Select,
  Label,
  toast,
} from "@medusajs/ui"
import { ShoppingBag } from "@medusajs/icons"
import type { RouteConfig } from "@mercurjs/dashboard-sdk"

type Seller = {
  id: string
  name: string
  email: string
  status: string
  send_seller_profile?: VilijProfile | null
}

type VilijProfile = {
  id: string
  vilij_stage: string
  is_founding: boolean
  is_vilij_verified: boolean
  send_connection?: string | null
  business_stage?: string | null
  why_belongs?: string | null
  story?: string | null
}

const STAGES = [
  "applied",
  "in_review",
  "approved_pending_welcome",
  "onboarding",
  "active",
  "paused",
  "rejected",
]

const api = (path: string, init?: RequestInit) =>
  fetch(path, { credentials: "include", ...init }).then(async (r) => {
    if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.message || r.statusText)
    return r.json()
  })

const SendCurationPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [selected, setSelected] = useState<Seller | null>(null)
  const [profile, setProfile] = useState<VilijProfile | null>(null)
  const [loading, setLoading] = useState(false)

  // review form state
  const [checklist, setChecklist] = useState({
    trust: false,
    authenticity: false,
    curation_fit: false,
    quality: false,
    notes: "",
    decision: "",
  })
  const [stage, setStage] = useState<string>("")
  const [founding, setFounding] = useState(false)
  const [verified, setVerified] = useState(false)

  const loadSellers = async () => {
    const { sellers } = await api(
      "/admin/sellers?fields=id,name,email,status,send_seller_profile.vilij_stage,send_seller_profile.is_founding,send_seller_profile.is_vilij_verified&limit=100"
    )
    setSellers(sellers ?? [])
  }

  useEffect(() => {
    loadSellers().catch((e) => toast.error(e.message))
  }, [])

  const openSeller = async (s: Seller) => {
    setSelected(s)
    const { seller } = await api(`/admin/sellers/${s.id}/vilij`)
    const p: VilijProfile | null = seller?.send_seller_profile ?? null
    setProfile(p)
    setStage(p?.vilij_stage ?? "applied")
    setVerified(!!p?.is_vilij_verified)
    setFounding(false)
    setChecklist({
      trust: false,
      authenticity: false,
      curation_fit: false,
      quality: false,
      notes: "",
      decision: "",
    })
  }

  const save = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await api(`/admin/sellers/${selected.id}/vilij`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_vilij_verified: verified,
          checklist: checklist.decision || checklist.notes ? checklist : undefined,
          stage,
          founding,
        }),
      })
      toast.success(`Updated ${selected.name}`)
      await loadSellers()
      await openSeller(selected)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">SEND curation</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Review founding sellers against trust, authenticity, fit and quality.
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Seller list */}
        <div className="border-r">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Seller</Table.HeaderCell>
                <Table.HeaderCell>Stage</Table.HeaderCell>
                <Table.HeaderCell>Badges</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sellers.map((s) => (
                <Table.Row
                  key={s.id}
                  className="cursor-pointer"
                  onClick={() => openSeller(s).catch((e) => toast.error(e.message))}
                >
                  <Table.Cell>
                    <div className="flex flex-col">
                      <Text size="small" weight="plus">{s.name}</Text>
                      <Text size="xsmall" className="text-ui-fg-subtle">{s.email}</Text>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge size="2xsmall">{s.send_seller_profile?.vilij_stage ?? "—"}</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-1">
                      {s.send_seller_profile?.is_founding && (
                        <Badge size="2xsmall" color="purple">Founding</Badge>
                      )}
                      {s.send_seller_profile?.is_vilij_verified && (
                        <Badge size="2xsmall" color="green">Verified</Badge>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        {/* Review panel */}
        <div className="p-6">
          {!selected ? (
            <Text className="text-ui-fg-subtle">Select a seller to review.</Text>
          ) : (
            <div className="flex flex-col gap-4">
              <Heading level="h2">{selected.name}</Heading>

              {profile?.send_connection && (
                <div>
                  <Label size="small" weight="plus">SEND connection</Label>
                  <Text size="small">{profile.send_connection}</Text>
                </div>
              )}
              {profile?.why_belongs && (
                <div>
                  <Label size="small" weight="plus">Why this belongs</Label>
                  <Text size="small">{profile.why_belongs}</Text>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {(["trust", "authenticity", "curation_fit", "quality"] as const).map((k) => (
                  <div key={k} className="flex items-center gap-2">
                    <Switch
                      checked={(checklist as any)[k]}
                      onCheckedChange={(v) => setChecklist((c) => ({ ...c, [k]: v }))}
                    />
                    <Label size="small" className="capitalize">{k.replace("_", " ")}</Label>
                  </div>
                ))}
              </div>

              <div>
                <Label size="small" weight="plus">Reviewer notes</Label>
                <Textarea
                  value={checklist.notes}
                  onChange={(e) => setChecklist((c) => ({ ...c, notes: e.target.value }))}
                  placeholder="What makes this seller right for The Vilij?"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label size="small" weight="plus">Decision</Label>
                  <Select value={checklist.decision} onValueChange={(v) => setChecklist((c) => ({ ...c, decision: v }))}>
                    <Select.Trigger><Select.Value placeholder="—" /></Select.Trigger>
                    <Select.Content>
                      <Select.Item value="approved">Approved</Select.Item>
                      <Select.Item value="hold">Hold</Select.Item>
                      <Select.Item value="rejected">Rejected</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                <div>
                  <Label size="small" weight="plus">Set stage</Label>
                  <Select value={stage} onValueChange={setStage}>
                    <Select.Trigger><Select.Value /></Select.Trigger>
                    <Select.Content>
                      {STAGES.map((st) => (
                        <Select.Item key={st} value={st}>{st}</Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={verified} onCheckedChange={setVerified} />
                  <Label size="small">Vilij Verified</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={founding} onCheckedChange={setFounding} />
                  <Label size="small">Founding Seller (start 0% / 12mo on activate)</Label>
                </div>
              </div>

              <Button onClick={save} isLoading={loading} variant="primary">
                Save review
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}

export const config: RouteConfig = {
  label: "SEND curation",
  icon: ShoppingBag,
}

export default SendCurationPage
