import { type TParsedServerContent } from "@/lib/endpoint/type";

export type TGetScheduleResponse = {
  message: string;
  data: TParsedServerContent[];
};
