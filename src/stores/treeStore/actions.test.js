import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTreeStore } from './index'
import { MAX_JSON_SIZE } from './utils'

const sampleJson = JSON.stringify({
  users: {
    admin: { name: 'John' },
    guest: { name: 'Jane' }
  }
})

function createStore () {
  setActivePinia(createPinia())
  return useTreeStore()
}

describe('treeStore actions', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  describe('setJsonData', () => {
    it('loads valid JSON and selects the root key', () => {
      store.setJsonData(sampleJson)

      expect(store.error).toBe('')
      expect(store.jsonData).toEqual(JSON.parse(sampleJson))
      expect(store.selectedPath).toEqual(['users'])
      expect(store.hasData).toBe(true)
    })

    it('rejects empty input', () => {
      store.setJsonData('   ')

      expect(store.error).toBe('JSON input cannot be empty')
      expect(store.jsonData).toBeNull()
    })

    it('rejects invalid JSON', () => {
      store.setJsonData('{ invalid }')

      expect(store.error).toBeTruthy()
      expect(store.jsonData).toBeNull()
    })

    it('rejects payloads larger than 5MB', () => {
      const oversized = '{' + '"a":'.repeat(Math.ceil(MAX_JSON_SIZE / 4)) + '"x"}'
      store.setJsonData(oversized)

      expect(store.error).toBe('JSON input exceeds 5MB limit')
    })

    it('strips unsafe prototype keys during import', () => {
      store.setJsonData('{"users":{"__proto__":{"polluted":true},"admin":"John"}}')

      expect(store.jsonData.users.admin).toBe('John')
      expect(Object.hasOwn(store.jsonData.users, '__proto__')).toBe(false)
      expect(Object.prototype.polluted).toBeUndefined()
    })
  })

  describe('deleteNode', () => {
    beforeEach(() => {
      store.setJsonData(sampleJson)
    })

    it('deletes a nested node and selects the parent', () => {
      store.setSelectedPath(['users', 'admin'])
      store.deleteNode(['users', 'admin'])

      expect(store.jsonData.users.admin).toBeUndefined()
      expect(store.selectedPath).toEqual(['users'])
    })

    it('prevents deleting the root node', () => {
      store.deleteNode(['users'])

      expect(store.error).toBe('Cannot delete root node')
      expect(store.jsonData.users).toBeDefined()
    })
  })

  describe('renameNode', () => {
    beforeEach(() => {
      store.setJsonData(sampleJson)
    })

    it('renames a nested node and updates selection', () => {
      store.setSelectedPath(['users', 'guest'])
      store.renameNode(['users', 'guest'], 'visitor')

      expect(store.jsonData.users.visitor).toEqual({ name: 'Jane' })
      expect(store.jsonData.users.guest).toBeUndefined()
      expect(store.selectedPath).toEqual(['users', 'visitor'])
    })

    it('rejects duplicate sibling names', () => {
      store.renameNode(['users', 'guest'], 'admin')

      expect(store.error).toBe('Node "admin" already exists')
      expect(store.jsonData.users.guest).toBeDefined()
    })
  })

  describe('moveNode', () => {
    beforeEach(() => {
      store.setJsonData(JSON.stringify({
        root: {
          foo: { bar: 'value' },
          hello: { world: 'test' }
        }
      }))
    })

    it('moves a node inside another branch', () => {
      store.moveNode(['root', 'foo'], ['root', 'hello'], 'inside')

      expect(store.jsonData.root.foo).toBeUndefined()
      expect(store.jsonData.root.hello.foo).toEqual({ bar: 'value' })
    })

    it('blocks moves that would create a descendant cycle', () => {
      const before = JSON.parse(JSON.stringify(store.jsonData))
      store.moveNode(['root', 'foo'], ['root', 'foo', 'bar'], 'inside')

      expect(store.jsonData).toEqual(before)
    })
  })

  describe('undoLastAction', () => {
    it('restores the previous tree state', () => {
      store.setJsonData(sampleJson)
      store.deleteNode(['users', 'guest'])
      store.undoLastAction()

      expect(store.jsonData.users.guest).toEqual({ name: 'Jane' })
      expect(store.error).toBe('')
    })

    it('reports when there is nothing to undo', () => {
      store.undoLastAction()

      expect(store.error).toBe('Nothing to undo')
    })
  })
})
