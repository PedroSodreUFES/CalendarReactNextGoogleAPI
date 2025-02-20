import { Checkbox, Heading, MultiStep, Text, TextInput, Button } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { IntervalBox, IntervalDay, IntervalInputs, IntervalItem, IntervalsContainer, FormError } from "./styles";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinute } from "@/utils/conver-time-string-to-minutes";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const timeIntervalsFormSchema = z.object({
    intervals: z.array(
        z.object({
            weekDay: z.number().min(0).max(6),
            enabled: z.boolean(),
            startTime: z.string(),
            endTime: z.string()
        })
    ).length(7)// tem que ter sempre 7 itens
        .transform(intervals => intervals
            .filter(interval => interval.enabled === true)) // só passar os enabled
        .refine(intervals => intervals.length > 0, {
            message: "Você precisa selecionar pelo menos um dia da semana!",
        })
        .transform(intervals => {
            return intervals.map(interval => {
                return {
                    weekDay: interval.weekDay,
                    startTimeInMinutes: convertTimeStringToMinute(interval.startTime),
                    endTimeInMinutes: convertTimeStringToMinute(interval.endTime),
                }
            })
        })
        .refine(intervals => {
            return intervals.every(interval => interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes)
        }, {
            message: "O horário do término deve ser pelo menos 1h distante do início"
        })
    , // tem q ter mais de 0 objetos
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {

    const { register, handleSubmit, watch, control, formState: { isSubmitting, errors, } }
        = useForm<TimeIntervalsFormInput, unknown, TimeIntervalsFormOutput>({
            resolver: zodResolver(timeIntervalsFormSchema),
            defaultValues: {
                intervals: [
                    { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
                    { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
                    { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
                    { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
                    { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
                    { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
                    { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
                ]
            },
        })

    const router = useRouter()

    const weekDays = getWeekDays()

    const { fields } = useFieldArray({
        control,
        name: 'intervals',
    })

    const intervals = watch('intervals')

    async function handleSetTimeIntervals(data: TimeIntervalsFormOutput) {
        const { intervals, } = data

        await api.post('users/time-intervals', {
            intervals,
        })

        await router.push('/register/update-profile')
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Quase lá
                </Heading>
                <Text>
                    Precisamos de algumas informações para criar seu perfil!
                    Ah, você pode editar essas informações depois.
                </Text>

                <MultiStep size={4} currentStep={3} />
            </Header>

            <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)} >
                <IntervalsContainer>
                    {
                        fields.map((field, index) => {
                            return (
                                <IntervalItem key={field.id}>
                                    <IntervalDay>
                                        <Controller
                                            name={`intervals.${index}.enabled`}
                                            control={control}
                                            render={({ field }) => {
                                                return (
                                                    <Checkbox
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked === true)
                                                        }}
                                                        checked={field.value}
                                                    />
                                                )
                                            }}
                                        />
                                        <Text>{weekDays[field.weekDay]}</Text>
                                    </IntervalDay>
                                    <IntervalInputs>
                                        <TextInput
                                            size="sm"
                                            type="time"
                                            step={60}
                                            onPointerEnterCapture={undefined}
                                            {...register(`intervals.${index}.startTime`)}
                                            onPointerLeaveCapture={undefined}
                                            crossOrigin={undefined}
                                            disabled={intervals[index].enabled === false}
                                        />
                                        <TextInput
                                            size="sm"
                                            type="time"
                                            step={60}
                                            onPointerEnterCapture={undefined}
                                            {...register(`intervals.${index}.endTime`)}
                                            onPointerLeaveCapture={undefined}
                                            crossOrigin={undefined}
                                            disabled={intervals[index].enabled === false}
                                        />
                                    </IntervalInputs>
                                </IntervalItem>
                            )
                        })
                    }
                </IntervalsContainer>

                {errors.intervals && (
                    <FormError size='sm'>{errors.intervals.root?.message}</FormError>
                )}

                <Button type="submit" disabled={isSubmitting}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </IntervalBox>


        </Container>
    )
}