import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../server";

describe("E2E: Flujo Completo de Descarga", () => {

  it("flujo completo: crear descarga mock y verificar que aparece en lista", async () => {
    const crear = await request(app)
      .post("/api/descargas")
      .send({ url: "http://mock.test/file.zip", tipo: "mock", maxReintentos: 1 });
    expect(crear.status).toBe(201);
    const id = crear.body.id;

    const lista = await request(app).get("/api/descargas");
    const encontrada = lista.body.find((d: any) => d.id === id);
    expect(encontrada).toBeDefined();

    const estado = await request(app).get(`/api/descargas/${id}/estado`);
    expect(["pending", "in_progress", "completed", "error"]).toContain(estado.body.estado);
  });

  it("flujo: URL invalida devuelve error 400", async () => {
    const res = await request(app)
      .post("/api/descargas")
      .send({ url: "esto-no-es-url", tipo: "mock", maxReintentos: 1 });
    expect(res.status).toBe(400);
  });

  it("flujo: descarga inexistente devuelve 404", async () => {
    const res = await request(app).get("/api/descargas/no-existe/estado");
    expect(res.status).toBe(404);
  });
});