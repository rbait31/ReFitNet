"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createResult, updateResult } from "@/app/actions/result-actions"
import { Textarea } from "@/components/ui/textarea"

const resultSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(200, "Заголовок слишком длинный"),
  content: z.string().min(1, "Содержание обязательно"),
  isPublic: z.boolean(),
})

type ResultFormData = z.infer<typeof resultSchema>

interface ResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  result?: {
    id: string
    title: string
    content: string
    isPublic: boolean
  }
  onSuccess?: () => void
}

export function ResultDialog({
  open,
  onOpenChange,
  result,
  onSuccess,
}: ResultDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!result

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      title: "",
      content: "",
      isPublic: false,
    },
  })

  const isPublic = watch("isPublic")

  // Сброс формы при открытии/закрытии
  useEffect(() => {
    if (open) {
      if (result) {
        reset({
          title: result.title,
          content: result.content,
          isPublic: result.isPublic,
        })
      } else {
        reset({
          title: "",
          content: "",
          isPublic: false,
        })
      }
    }
  }, [open, result, reset])

  const onSubmit = async (data: ResultFormData) => {
    setIsSubmitting(true)
    try {
      let response
      if (isEdit && result) {
        response = await updateResult({
          id: result.id,
          ...data,
        })
      } else {
        response = await createResult(data)
      }

      if (response.success) {
        onSuccess?.()
        onOpenChange(false)
      } else {
        alert(response.error || "Ошибка при сохранении")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Ошибка при сохранении")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редактировать результат" : "Новый результат"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Внесите изменения в результат"
              : "Создайте новый результат. Вы можете сделать его публичным или оставить приватным."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Введите заголовок результата"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Содержание</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Введите содержание результата"
              rows={8}
              className="resize-none"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={isPublic}
              onChange={(e) => setValue("isPublic", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Сделать публичным
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Сохранение..."
                : isEdit
                ? "Сохранить"
                : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

