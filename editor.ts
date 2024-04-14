import { Router } from "express";
import { renderView } from "./util";
import { readdir, readFile } from 'fs/promises'
import path from 'path'

const router = Router()

export interface Level {
    song: string
    bpm: number
    firstOffset: number
    tests: Record<string, string>
    id: string
    zadanie: string
}

const levels: Record<string, Level> = {}
const zadania: Record<string, string> = {}

router.get('/', (req,res) => {
    const firstLevel = Object.keys(levels)[0]
    res.redirect('/editor/' + firstLevel)
})

router.get('/:lid', async (req, res) => {
    if(req.session.user == undefined) {
        res.redirect('/')
        return
    }
    const lid = req.params.lid
    if(levels[lid] == undefined) {
        res.sendStatus(404)
        return
    }
    
    renderView(res, 'editor', {
        user: req.session.user, 
        levels: Object.keys(levels),
        zadanie: zadania[req.params.lid],
        data: JSON.stringify(levels[req.params.lid])
    });
})

async function loadLevels() {
    const p = path.join(__dirname, 'levels')
    const keys = await readdir(p)
    for (const level of keys) {
        levels[level] = JSON.parse(await readFile(path.join(p, level, 'data.json'), 'utf-8'))
        zadania[level] = await readFile(path.join(p, level, 'index.html'), 'utf-8')
        levels[level].zadanie = zadania[level]
        levels[level].id = level
    }

    console.log(`Loaded ${Object.keys(levels).length} levels`);
    
}

loadLevels()
export default router
