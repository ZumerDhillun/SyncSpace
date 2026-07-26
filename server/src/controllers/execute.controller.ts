import { Response } from 'express'
import { executeCode } from '../lib/executor'
import { executeSchema } from '../utils/validators'
import { AuthedRequest } from '../middleware/auth.middleware'

export async function execute(req: AuthedRequest, res: Response) {
  const { code, language, stdin } = executeSchema.parse(req.body)
  try {
    const result = await executeCode(code, language, stdin)
    res.json(result)
  } catch (err: any) {
    res.status(502).json({
      message: 'Code execution failed. Check your JDoodle credentials / daily quota.',
      detail: err?.message,
    })
  }
}
