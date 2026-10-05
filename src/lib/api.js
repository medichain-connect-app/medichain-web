const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

function authHeaders() {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(method, path, { body, params, file } = {}) {
  let url = `${BASE}${path}`
  if (params) {
    const q = new URLSearchParams(params).toString()
    if (q) url += `?${q}`
  }

  const headers = { ...authHeaders() }
  let fetchBody

  if (file) {
    const fd = new FormData()
    fd.append('file', file)
    if (body) Object.entries(body).forEach(([k, v]) => fd.append(k, v))
    fetchBody = fd
  } else if (body) {
    headers['Content-Type'] = 'application/json'
    fetchBody = JSON.stringify(body)
  }

  const res = await fetch(url, { method, headers, body: fetchBody })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res
}

export const api = {
  get: (path, params) => request('GET', path, { params }),
  post: (path, body) => request('POST', path, { body }),
  put: (path, body) => request('PUT', path, { body }),
  patch: (path, body) => request('PATCH', path, { body }),
  delete: (path) => request('DELETE', path),
  upload: (path, file, body) => request('POST', path, { file, body }),
  downloadUrl: (path) => {
    const token = localStorage.getItem('access_token')
    return `${BASE}${path}?token=${encodeURIComponent(token || '')}`
  },
  download: async (path) => {
    const url = `${BASE}${path}`
    const res = await fetch(url, { headers: authHeaders() })
    if (!res.ok) throw new Error('Download failed')
    return res.blob()
  },
}
