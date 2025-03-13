import {
  EntityId,
  ExtractEntityValuesMapping,
  getEntityConfigMapping,
} from "@repo/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/utils/styles";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import useEntities from "@/hooks/use-entities";

type IEexForm<TEntityId extends EntityId<"eex">> = {
  filter: ExtractEntityValuesMapping<TEntityId>["filter"];
  id: TEntityId;
  onSuccess: () => void;
};

function EexForm<TEntityId extends EntityId<"eex">>({
  filter,
  id,
  onSuccess,
}: IEexForm<TEntityId>) {
  const { update } = useEntities();
  const entity = getEntityConfigMapping("eex");
  const formSchema = entity.filterSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: filter,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    update({ id, filter: values });
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Produkt</FormLabel>
                <FormControl>
                  <Input placeholder="/E.ATBYF19" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketArea"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Markede</FormLabel>
                <FormControl>
                  <Input placeholder="AT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deliveryPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leveringsperiode</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="YEAR" />
                  </SelectTrigger>
                  <SelectContent>
                    {formSchema.shape.deliveryPeriod
                      .unwrap()
                      .options.map((period) => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="interval"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="intervalType"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Interval type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="h" />
                    </SelectTrigger>
                    <SelectContent>
                      {formSchema.shape.intervalType.options.map((interval) => (
                        <SelectItem key={interval} value={interval}>
                          {interval}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </div>

        <div className="flex w-full gap-2">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Fra</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Vælg dato</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Til</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Vælg dato</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default EexForm;
