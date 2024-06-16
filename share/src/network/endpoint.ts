import { RequestMethod } from "./request.js";

export interface EndpointOptions {
  filePath: string;
  methods: RequestMethod[];
  name: string;
  path: string;
}
