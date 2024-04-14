import fs from 'fs/promises'
import { spawn } from 'child_process'
import path from 'path';
import { Level } from './editor';

const TIME_LIMIT = 5000

export async function test(submit: string, user: string, level: Level): Promise<TestOutput> {
    if(submit.match('import') != null)
        throw new Error('Imports are not allowed');

    const programPath = path.join(__dirname, 'levels', level.id, 'submits', user + '.py')
    fs.writeFile(programPath, submit);

    let out: TestOutput
    for (const test of Object.keys(level.tests)) {
        out = await testInput(programPath, test, level.tests[test])
        if(out.status != 'OK'){
            return out
        }
    }

    return out!
}

interface TestOutput {
    status: 'WA' | 'OK' | 'TLE' | 'EXC'
}

async function testInput(program: string, input: string, output: string): Promise<TestOutput> {
    return new Promise(async (resolve, reject)=> {
        const p = spawn('python3 ' + program)
        p.on('error', reject)
        p.stdin.write(await fs.readFile(input))
        let out = ''
        p.stdout.on('data', (chunk)=> {
            out += chunk
        })
        p.stderr.on('data', ()=> {
            clearTimeout(timeout)
            p.kill('SIGKILL')
            resolve({
                status: 'EXC'
            })
        })
        const expectedOutput = await fs.readFile(output, 'utf-8')
        p.on('exit', () => {
            clearTimeout(timeout)
            if(out != expectedOutput) {
                resolve({
                    status: 'WA'
                })
            }
            return resolve({
                status: 'OK'
            })
        })

        const timeout = setTimeout(() => {
            p.kill('SIGKILL')
            resolve({
                status: 'TLE'
            })
        }, TIME_LIMIT);
    })
}