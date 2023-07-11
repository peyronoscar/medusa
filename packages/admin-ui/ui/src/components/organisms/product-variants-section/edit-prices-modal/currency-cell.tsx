import React, { useEffect, useState } from "react"
import { ProductVariant } from "@medusajs/client-types"
import AmountField from "react-currency-input-field"
import clsx from "clsx"

import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"
import { useAdminRegions } from "medusa-react"

function useCurrencyMeta(
  currencyCode: string | undefined,
  regionId: string | undefined
) {
  const { regions } = useAdminRegions()
  if (currencyCode) {
    return CURRENCY_MAP[currencyCode?.toUpperCase()]
  }

  if (regions) {
    const region = regions.find((r) => r.id === regionId)
    return CURRENCY_MAP[region!.currency_code.toUpperCase()]
  }
}

type CurrencyCellProps = {
  currencyCode?: string
  region?: string

  variant: ProductVariant
  editedAmount?: number
  isSelected?: boolean
  isDragging?: boolean

  onDragStart: (
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => void
  onDragEnd: () => void

  onMouseCellClick: (
    event: React.MouseEvent,
    variantId: string,
    currencyCode?: string,
    regionId?: string
  ) => void

  onInputChange: (
    value: number | undefined,
    variantId: string,
    currencyCode?: string,
    regionId?: string,
    persist?: boolean
  ) => void
}

/**
 * Amount cell container.
 */
function CurrencyCell(props: CurrencyCellProps) {
  const {
    variant,
    currencyCode,
    region,
    editedAmount,
    isSelected,
    isDragging,
  } = props

  const currencyMeta = useCurrencyMeta(currencyCode, region)

  const [showDragIndicator, setShowDragIndicator] = useState(false)
  const [localValue, setLocalValue] = useState({
    value: editedAmount,
    float: editedAmount,
  })

  useEffect(() => {
    setLocalValue({ value: editedAmount, float: editedAmount })
  }, [editedAmount])

  return (
    <td
      onMouseDown={(e) =>
        props.onMouseCellClick(e, variant.id, currencyCode, region)
      }
      className={clsx("relative border pr-2 pl-4", {
        "bg-blue-100": isSelected,
      })}
    >
      <div className="flex">
        <span className="text-gray-400">{currencyMeta?.symbol_native}</span>
        <AmountField
          onFocus={() => {
            setShowDragIndicator(true)
          }}
          onBlur={() => {
            setShowDragIndicator(false)
            props.onInputChange(
              localValue.float,
              variant.id,
              currencyCode,
              region
            )
          }}
          style={{ width: "100%", textAlign: "right", paddingRight: 8 }}
          className={clsx("decoration-transparent focus:outline-0", {
            "bg-blue-100": isSelected,
          })}
          onValueChange={(_a, _b, v) => setLocalValue(v)}
          decimalsLimit={currencyMeta?.decimal_digits || 2}
          decimalSeparator="."
          value={localValue.value}
        ></AmountField>
        {showDragIndicator && (
          <div
            style={{ bottom: -4, right: -4, zIndex: 9999 }}
            onMouseDown={(event) => {
              document.body.style.userSelect = "none"
              event.stopPropagation()
              props.onInputChange(
                localValue.float,
                variant.id,
                currencyCode,
                region,
                true
              )
              props.onDragStart(variant.id, currencyCode, region)
            }}
            className="absolute h-2 w-2 cursor-pointer rounded-full bg-blue-400"
          />
        )}
      </div>
    </td>
  )
}

export default CurrencyCell