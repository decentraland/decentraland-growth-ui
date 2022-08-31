let data = Buffer.from('')
process.stdin.on('data', (chunk) => {
  data = Buffer.concat([data, chunk], data.length + chunk.length)
})
process.stdin.on('close', () => {
  /** @type {{ file: string, tag: string, line: number, ref?: string, text: string}[]} */
  const todos = JSON.parse(data.toString('utf8'))

  console.log('# TODOs')
  console.log('')
  console.log(`| Filename |   Ref  | TODO     |`)
  console.log(`| :------- | :----: | :------- |`)
  for (const todo of todos) {
    const file = `[${todo.file}](${todo.file}#L${todo.line})`

    let ref = `      `
    if (todo.ref && todo.ref.startsWith('#')) {
      const issue = `issues/${todo.ref.slice(1)}`
      ref = `[${issue}](${issue})`
    } else if (todo.ref && todo.ref.startsWith('@')) {
      ref = todo.ref
    } else if (todo.ref) {
      ref = '@' + todo.ref
    }

    console.log(`| ${file} | ${ref} | ${todo.text} |`)
  }
  console.log('')
})
