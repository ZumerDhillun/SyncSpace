import axios from 'axios'

// JDoodle language identifiers. versionIndex "0" is used for every language
// because it's the one version index JDoodle guarantees exists for all of
// them — see https://docs.jdoodle.com/compiler-api/compiler-api#what-languages-and-versions-supported
// if you want to pin a specific newer version per language instead.
const LANGUAGE_MAP: Record<string, { language: string; versionIndex: string }> = {
  javascript: { language: 'nodejs', versionIndex: '0' },
  typescript: { language: 'typescript', versionIndex: '0' },
  python: { language: 'python3', versionIndex: '0' },
  java: { language: 'java', versionIndex: '0' },
  cpp: { language: 'cpp17', versionIndex: '0' },
  go: { language: 'go', versionIndex: '0' },
  rust: { language: 'rust', versionIndex: '0' },
}

export interface ExecutionResult {
  stdout: string
  stderr: string
  time: string | null
  memory: number | null
  status: string
}

export async function executeCode(
  code: string,
  language: string,
  stdin?: string
): Promise<ExecutionResult> {
  const mapped = LANGUAGE_MAP[language]
  if (!mapped) {
    throw new Error(`Unsupported language: ${language}`)
  }

  if (!process.env.JDOODLE_CLIENT_ID || !process.env.JDOODLE_CLIENT_SECRET) {
    throw new Error('JDOODLE_CLIENT_ID / JDOODLE_CLIENT_SECRET are missing from server/.env')
  }

  let data: any
  try {
    const response = await axios.post(
      'https://api.jdoodle.com/v1/execute',
      {
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script: code,
        stdin: stdin || '',
        language: mapped.language,
        versionIndex: mapped.versionIndex,
      },
      { timeout: 15000 }
    )
    data = response.data
  } catch (err: any) {
    // Surface JDoodle's actual error body instead of a generic axios message,
    // so real causes (quota exceeded, bad credentials, bad versionIndex) are visible.
    const jdoodleMessage =
      err.response?.data?.error || err.response?.data?.message || JSON.stringify(err.response?.data)
    throw new Error(
      jdoodleMessage && jdoodleMessage !== 'undefined'
        ? `JDoodle error: ${jdoodleMessage}`
        : err.message
    )
  }

  // JDoodle returns { output, statusCode, memory, cpuTime } — no separate
  // stdout/stderr split, so we treat a non-200 statusCode as an error.
  const isError = data.statusCode && data.statusCode !== 200
  return {
    stdout: isError ? '' : data.output || '',
    stderr: isError ? data.output || 'Execution failed' : '',
    time: data.cpuTime ? String(data.cpuTime) : null,
    memory: data.memory ? Number(data.memory) : null,
    status: isError ? 'Error' : 'Success',
  }
}
