-- ===========================================================
-- CREACIÓN DE BASE DE DATOS
-- ===========================================================

CREATE DATABASE IF NOT EXISTS juego_zombie_db;
USE juego_zombie_db;

-- ===========================================================
-- ELIMINACIÓN DE TABLAS EXISTENTES
-- ===========================================================

DROP TABLE IF EXISTS Relation_4;
DROP TABLE IF EXISTS Relation_3;
DROP TABLE IF EXISTS mejora_habilidad;
DROP TABLE IF EXISTS habilidad;
DROP TABLE IF EXISTS clase;
DROP TABLE IF EXISTS personajes;

-- ===========================================================
-- TABLAS BASE
-- ===========================================================

CREATE TABLE personajes (
    id_personaje INT NOT NULL,
    nombre_personaje VARCHAR(50) NOT NULL,
    nivel_personaje INT NOT NULL,
    PRIMARY KEY (id_personaje)
);

CREATE TABLE clase (
    id_clase INT NOT NULL,
    nombre_clase VARCHAR(30) NOT NULL,
    personaje_id_personaje INT NOT NULL,
    PRIMARY KEY (id_clase),
    CONSTRAINT fk_clase_personaje FOREIGN KEY (personaje_id_personaje)
        REFERENCES personajes(id_personaje)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX clase_UNQ_personaje ON clase (personaje_id_personaje);

CREATE TABLE habilidad (
    id_habilidad INT NOT NULL,
    nombre_habilidad VARCHAR(100) NOT NULL,
    descripcion_habilidad TEXT NOT NULL,
    PRIMARY KEY (id_habilidad)
);

CREATE TABLE mejora_habilidad (
    id_mejora INT NOT NULL,
    nivel_mejora INT NOT NULL,
    descripcion_mejora TEXT NOT NULL,
    nivel_requerido_personaje INT NOT NULL,
    PRIMARY KEY (id_mejora)
);

-- ===========================================================
-- RELACIONES
-- ===========================================================

CREATE TABLE Relation_3 (
    clase_id_clase INT NOT NULL,
    habilidad_id_habilidad INT NOT NULL,
    PRIMARY KEY (clase_id_clase, habilidad_id_habilidad),
    CONSTRAINT fk_r3_clase FOREIGN KEY (clase_id_clase)
        REFERENCES clase(id_clase)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_r3_habilidad FOREIGN KEY (habilidad_id_habilidad)
        REFERENCES habilidad(id_habilidad)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Relation_4 (
    habilidad_id_habilidad INT NOT NULL,
    mejora_habilidad_id_mejora INT NOT NULL,
    PRIMARY KEY (habilidad_id_habilidad, mejora_habilidad_id_mejora),
    CONSTRAINT fk_r4_habilidad FOREIGN KEY (habilidad_id_habilidad)
        REFERENCES habilidad(id_habilidad)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_r4_mejora FOREIGN KEY (mejora_habilidad_id_mejora)
        REFERENCES mejora_habilidad(id_mejora)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===========================================================
-- INSERCIÓN DE DATOS
-- ===========================================================

-- PERSONAJES
INSERT INTO personajes VALUES 
(11, 'El negros', 1),
(21, 'Agustin', 1),
(31, 'Ferninad', 1),
(43, 'Suka blyat', 1),
(53, 'Den schei', 1),
(64, 'Konami', 1),
(75, 'Dante', 1);

-- CLASES
INSERT INTO clase VALUES 
(1, 'Swat', 11),
(2, 'Tanque', 21),
(3, 'Ingeniero', 31),
(4, 'Cazadora', 43),
(5, 'Fantasma', 53),
(6, 'Medico', 64),
(7, 'Pyro', 75);

-- HABILIDADES (IDs ordenados del 1 al 21)
INSERT INTO habilidad VALUES
(1, 'Rastro de Granadas', 'Lanza automáticamente granadas hacia atrás al moverse. +1 granada por nivel.'),
(2, 'Ataque de Helicóptero', 'Un helicóptero dispara desde el aire. Reduce su enfriamiento al subir de nivel.'),
(3, 'Torreta Automática', 'Despliega torretas que disparan automáticamente a los enemigos.'),
(4, 'Dron de Hoja de Sierra', 'Crea una hoja giratoria que daña a los enemigos. +1 hoja por nivel, hasta 5.'),
(5, 'Minas Terrestres', 'Planta minas explosivas en el suelo. Aumenta el número y reduce recarga.'),
(6, 'Bombardeo Aéreo', 'Un avión lanza bombas en área. Mejora en daño y alcance.'),
(7, 'Electrocución', 'Daño eléctrico en área. Escala en radio y reduce cooldown.'),
(8, 'Torreta Eléctrica', 'Torreta que dispara rayos. Aumenta cadencia con el nivel.'),
(9, 'Escudo de Energía', 'Campo que aturde y daña a los enemigos. Mejora en área.'),
(10, 'Ojo de Águila', 'Aumenta el golpe crítico en +4% por nivel.'),
(11, 'Lluvia de Flechas', 'Lanza múltiples flechas en área. Aumenta daño con cada nivel.'),
(12, 'Señuelo Zombi', 'Atrae zombis y explota. Mejora alcance y daño.'),
(13, 'Shurikens', 'Lanza proyectiles atravesantes. +1 por nivel.'),
(14, 'Proyecto: Crítico', 'Otorga +50% de crítico durante 5s. +1s por nivel.'),
(15, 'Danza de Kunai', 'Lanza 10 kunais en círculo. Escala en daño y número.'),
(16, 'Doctor', 'Cura al equipo pasivamente. +2 HP/s por nivel.'),
(17, 'Trasplantología', 'Otorga robo de vida. Aumenta duración con el nivel.'),
(18, 'Estimulador', 'Aumenta velocidad de disparo y movimiento. +1s por nivel.'),
(19, 'Muro de Llamas', 'Pared de fuego que quema al pasar. Escala en daño.'),
(20, 'Explosión Ígnea', 'Onda expansiva de fuego. Aumenta radio y daño.'),
(21, 'Frenesí Ardiente', 'Ataques incendian durante 4s. +10% daño por nivel.');

-- RELACIONES CLASE-HABILIDAD (actualizadas)
INSERT INTO Relation_3 VALUES
-- Swat
(1, 1), (1, 2), (1, 3),
-- Tanque
(2, 4), (2, 5), (2, 6),
-- Ingeniero
(3, 7), (3, 8), (3, 9),
-- Cazadora
(4, 10), (4, 11), (4, 12),
-- Fantasma
(5, 13), (5, 14), (5, 15),
-- Médico
(6, 16), (6, 17), (6, 18),
-- Pyro
(7, 19), (7, 20), (7, 21);

-- MEJORAS
INSERT INTO mejora_habilidad VALUES
(100, 1, 'Los atributos por cada nivel mejoran un 10%', 5),
(200, 1, 'Los atributos por cada nivel mejoran un 10%', 5),
(300, 1, 'Los atributos por cada nivel mejoran un 10%', 5),
(400, 1, 'Los atributos por cada nivel mejoran un 10%', 5),
(500, 1, 'Los atributos por cada nivel mejoran un 10%', 5),
(600, 1, 'Los atributos por cada nivel mejoran un 10%', 5),
(700, 1, 'Los atributos por cada nivel mejoran un 10%', 5);

-- RELACIONES HABILIDAD-MEJORA (actualizadas)
INSERT INTO Relation_4 VALUES
(1, 100), (2, 100), (3, 100),
(4, 200), (5, 200), (6, 200),
(7, 300), (8, 300), (9, 300),
(10, 400), (11, 400), (12, 400),
(13, 500), (14, 500), (15, 500),
(16, 700), (17, 700), (18, 700);

