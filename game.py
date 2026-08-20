import random
import time
from data import PARRILLA_2026, PUNTOS_SISTEMA

class Monoplaza:
    def __init__(self):
        self.componentes = {
            "Alerones": 1,
            "Motor": 1,
            "Frenos": 1,
            "Suspensión": 1
        }
    
    def obtener_rendimiento_total(self):
        return sum(self.componentes.values())

    def mejorar_componente(self, componente):
        if componente in self.componentes:
            self.componentes[componente] += 1

class JuegoF1Manager:
    def __init__(self):
        self.puntos_desarrollo = 0
        self.escuderia_usuario = ""
        self.piloto_usuario = ""
        self.auto = Monoplaza()
        self.carrera_actual = 1

    def seleccionar_equipo(self):
        print("=== SIMULADOR DE F1 MANAGER - TEMPORADA 2026 ===")
        print("\nSelecciona tu Escudería:")
        escuderias = list(PARRILLA_2026.keys())
        for i, esc in enumerate(escuderias, 1):
            print(f"{i}. {esc}")
        
        opcion = int(input("\nNúmero de escudería: ")) - 1
        self.escuderia_usuario = escuderias[opcion]
        
        print(f"\nPilotos disponibles en {self.escuderia_usuario}:")
        pilotos = PARRILLA_2026[self.escuderia_usuario]
        for i, pil in enumerate(pilotos, 1):
            print(f"{i}. {pil}")
            
        opcion_piloto = int(input("\n¿A qué piloto vas a dirigir principalmente?: ")) - 1
        self.piloto_usuario = pilotos[opcion_piloto]
        print(f"\n¡Felicidades Manager! Asumiste el mando en {self.escuderia_usuario} al frente de {self.piloto_usuario}.\n")

    def simular_carrera(self):
        print(f"\n--- DISPUTANDO GRAN PREMIO #{self.carrera_actual} ---")
        time.sleep(1)
        
        competidores = []
        for esc, pilotos in PARRILLA_2026.items():
            for p in pilotos:
                if p == self.piloto_usuario:
                    bonus = self.auto.obtener_rendimiento_total() * 2
                else:
                    bonus = random.randint(2, 10)
                score = random.randint(50, 100) + bonus
                competidores.append({"piloto": p, "escuderia": esc, "score": score})
        
        resultados = sorted(competidores, key=lambda x: x["score"], reverse=True)
        
        posicion_jugador = 0
        print("\nRESULTADOS DE LA CARRERA:")
        for pos, res in enumerate(resultados, 1):
            pts = PUNTOS_SISTEMA.get(pos, 0)
            es_tu_piloto = " <-- [TU PILOTO]" if res["piloto"] == self.piloto_usuario else ""
            print(f"P{pos:02d}: {res['piloto']} ({res['escuderia']}) +{pts} pts {es_tu_piloto}")
            
            if res["piloto"] == self.piloto_usuario:
                posicion_jugador = pos
                
        puntos_ganados = max(1, 23 - posicion_jugador) * 10
        self.puntos_desarrollo += puntos_ganados
        self.carrera_actual += 1
        
        print(f"\n¡Tu piloto finalizó en la posición P{posicion_jugador}!")
        print(f"Ganaste +{puntos_ganados} Puntos de Desarrollo (RP). Total RP: {self.puntos_desarrollo}")

    def taller_mejoras(self):
        while True:
            print("\n=== TALLER DE MEJORAS Y RENDIMIENTO ===")
            print(f"Puntos RP disponibles: {self.puntos_desarrollo}\n")
            for comp, nivel in self.auto.componentes.items():
                costo = nivel * 50
                print(f"- {comp} (Nivel {nivel}) | Costo de mejora: {costo} RP")
            print("- Salir (Volver al menú principal)")
            
            eleccion = input("\n¿Qué componente querés mejorar? (Alerones/Motor/Frenos/Suspensión/Salir): ").strip().capitalize()
            
            if eleccion == "Salir":
                break
                
            if eleccion in self.auto.componentes:
                costo = self.auto.componentes[eleccion] * 50
                if self.puntos_desarrollo >= costo:
                    self.puntos_desarrollo -= costo
                    self.auto.mejorar_componente(eleccion)
                    print(f"¡Excelente! {eleccion} subió al Nivel {self.auto.componentes[eleccion]}.")
                else:
                    print("¡No tenés suficientes Puntos de Desarrollo!")
            else:
                print("Componente inválido.")

    def menu_principal(self):
        self.seleccionar_equipo()
        while True:
            print("\n------------------------------")
            print("1. Simular Siguiente Carrera")
            print("2. Ir al Taller de Mejoras")
            print("3. Ver Estado del Auto")
            print("4. Salir del Juego")
            
            opcion = input("Elegí una opción: ")
            if opcion == "1":
                self.simular_carrera()
            elif opcion == "2":
                self.taller_mejoras()
            elif opcion == "3":
                print(f"\n--- ESTADO DEL MONOPLAZA ({self.escuderia_usuario}) ---")
                for k, v in self.auto.componentes.items():
                    print(f"{k}: Nivel {v}")
            elif opcion == "4":
                print("¡Gracias por jugar! Guardando datos...")
                break
