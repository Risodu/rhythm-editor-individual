import { Router } from "express";
import { renderView } from "./util";
import upgrades from "./upgrades";
import { db } from "./db";


const router = Router()

router.get('/', async (req, res) => {
    const user = await db.getUser(req.session.user?.id || -1) || undefined
    if(user == undefined){
        res.redirect('/')
        return
    }

    renderView(res, 'shop', {
        user: user,
        upgrades: upgrades.map(e=> {
            return {
                ...e,
                isPurchased: !e.purchased(user.upgrades)
            }
        })
    })
})

router.post('/activate/:id', async (req, res)=> {
    let user = await db.getUser(req.session.user?.id || -1) || undefined
    
    if(user == undefined){
        res.status(400)
        res.send('Invalid session')
        return
    }
    const id = parseInt(req.params.id)
    const upgrade = upgrades.find(e => e.id == id)
    if(!upgrade){
        res.status(400)
        res.send('Invalid upgrade')
        return
    }
    
    console.log(user?.upgrades.tolerance, req.session.user!.upgrades.tolerance);

    if(upgrade.purchased(user.upgrades)){
        res.status(400)
        res.send('upgrade already purchased')
    }

    user.upgrades = upgrade.apply(user.upgrades)
    
    await db.setUser(user)
    res.redirect('/shop')
})

router.post('/deactivate/:id', async (req, res)=> {
    let user = await db.getUser(req.session.user?.id || -1) || undefined
    
    if(user == undefined){
        res.status(400)
        res.send('Invalid session')
        return
    }
    const id = parseInt(req.params.id)
    const upgrade = upgrades.find(e => e.id == id)
    if(!upgrade){
        res.status(400)
        res.send('Invalid upgrade')
        return
    }
    
    console.log(user?.upgrades.tolerance, req.session.user!.upgrades.tolerance);

    if(!upgrade.purchased(user.upgrades)){
        res.status(400)
        res.send('upgrade not purchased')
    }

    user.upgrades = upgrade.unapply(user.upgrades)
    
    await db.setUser(user)
    res.redirect('/shop')
})

export default router