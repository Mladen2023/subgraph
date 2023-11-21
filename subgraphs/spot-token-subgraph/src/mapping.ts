import { BigInt } from "@graphprotocol/graph-ts"
import {
  Transfer
} from "../generated/Contract/Contract"
import { UserEntity, TradingEntity } from "../generated/schema"

export function handleTransfer(event: Transfer): void {
  let tradingEntity = TradingEntity.load("1")

  if (!tradingEntity) {
    tradingEntity = new TradingEntity("1")
    tradingEntity.amount = BigInt.fromI32(0)
  }

  tradingEntity.amount = tradingEntity.amount + event.params.value
  tradingEntity.save()

  let fromEntity = UserEntity.load(event.params.from.toHex())

  if (!fromEntity) {
    fromEntity = new UserEntity(event.params.from.toHex())
    fromEntity.count = BigInt.fromI32(0)
    fromEntity.amount = BigInt.fromI32(0)
    fromEntity.trading = BigInt.fromI32(0)
  }

  fromEntity.count = fromEntity.count + BigInt.fromI32(1)
  fromEntity.amount = fromEntity.amount - event.params.value
  fromEntity.trading = fromEntity.trading + event.params.value

  fromEntity.save()

  let toEntity = UserEntity.load(event.params.to.toHex())

  if (!toEntity) {
    toEntity = new UserEntity(event.params.to.toHex())
    toEntity.count = BigInt.fromI32(0)
    toEntity.amount = BigInt.fromI32(0)
    toEntity.trading = BigInt.fromI32(0)
  }
  
  toEntity.amount = toEntity.amount + event.params.value

  toEntity.save()
}