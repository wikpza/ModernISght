import express, {NextFunction, Response} from "express";
import {CardService} from "../services/card.service";
import {CardRepository} from "../repository/card.repository";
import {AuthenticatedRequest, checkTokenJWT, processId} from "./middlewares/user.middlewares";
import {RequestValidator} from "../utils/requestValidator";
import {CreateAddressRequest} from "../dto/addresses.dto";
import {addressService} from "./address.routes";
import {CreateCardRequest} from "../dto/card.dto";
import {allowOnlyLocalhost} from "./middlewares";

const router = express.Router()
const cardService = new CardService(new CardRepository())

router.post('/',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return res.status(400).json({message:"not found user"})

            const {errors, input} = await RequestValidator(
                CreateCardRequest,
                req.body
            )
            if(errors) return res.status(400).json(errors)
            const userId = processId(req.user._id)
            const data = await cardService.addCard({card:req.body, userId})


            return res.status(201).json(data)
        }catch (error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
router.delete('/:cardId',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return res.status(400).json({message:"not found user"})
            const userId = processId(req.user._id)
            const cardId = req.params.cardId
            const data = await cardService.deleteCard({idCard:cardId, userId})
            return res.status(201).json(data)
        }catch (error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/cardInfo/:id',
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return res.status(400).json({message:"not found user"})
            const userId = processId(req.user._id)
            const cardNumber = req.params.id as string
            const data = await cardService.getCardData({numberCard:cardNumber, userId})
            return res.status(201).json({cvv:data.cards[0].cvv, number:data.cards[0].number, expiryDate:data.cards[0].expiryDate})
        }catch (error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })

router.get('/',
    // allowOnlyLocalhost,
    checkTokenJWT,
    async(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user) return res.status(400).json({message:"not found user"})
            const userId = processId(req.user._id)
            const data = await cardService.getCards(userId)
            return res.status(201).json(data)
        }catch (error){
            const err = error as Error
            return res.status(500).json(err.message)
        }
    })
export default router