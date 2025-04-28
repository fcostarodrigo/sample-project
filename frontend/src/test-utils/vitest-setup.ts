import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { afterEach, beforeAll } from "vitest";

beforeAll(() => i18n.use(initReactI18next).init({}));

afterEach(() => {
  cleanup();
});
