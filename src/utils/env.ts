import { Env, isEnv } from '@dcl/ui-env/dist/env'
import { getEnvFromQueryParam, getEnvFromTLD } from '@dcl/ui-env/dist/location'

export type EnvRecord = Record<string, string | undefined>
export type EnvMap = Partial<Record<Env, EnvRecord>>

export { Env }

const ENVS: Map<Env, EnvRecord> = new Map()

function createEnvs(data: EnvRecord = {}) {
  const result: EnvRecord = {}

  if (typeof process !== 'undefined' && process.env) {
    Object.assign(result, process.env)
  }

  Object.assign(result, data)

  return result
}

function getEnv(): Env {
  if (typeof window !== 'undefined') {
    const envFromQueryParam = getEnvFromQueryParam(window.location)
    if (envFromQueryParam) {
      return envFromQueryParam
    }

    const envFromTLD = getEnvFromTLD(window.location)
    if (envFromTLD) {
      return envFromTLD
    }
  }

  if (isEnv(process.env.DCL_DEFAULT_ENV || '')) {
    return process.env.DCL_DEFAULT_ENV as Env
  }

  if (isEnv(process.env.GATSBY_DEFAULT_ENV || '')) {
    return process.env.GATSBY_DCL_DEFAULT_ENV as Env
  }

  return Env.DEVELOPMENT
}

function getEnvs() {
  const env = getEnv()
  if (!ENVS.has(env)) {
    ENVS.set(env, createEnvs())
  }

  return ENVS.get(env)!
}

function env(name: string): string | undefined
function env(name: string, defaultValue: string): string
function env(name: string, defaultValue?: string): string | undefined {
  const envs = getEnvs()
  return (
    envs[name] ||
    envs['GATSBY_' + name] ||
    envs['REACT_APP_' + name] ||
    envs['STORYBOOK_' + name] ||
    defaultValue
  )
}

export default env

export function requiredEnv(name: string): string {
  const value = env(name, '')

  if (!value) {
    throw new Error(
      `Missing "${name}" environment variable. Check your .env.example file`
    )
  }

  return value
}

export function setupEnv(envs: EnvMap = {}) {
  for (const env of Object.keys(envs)) {
    if (isEnv(env)) {
      ENVS.set(env, createEnvs(envs[env]))
    }
  }
}
