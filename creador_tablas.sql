USE Parking;

CREATE TABLE Vehiculo (
    ID_Vehiculo INT PRIMARY KEY AUTO_INCREMENT,
    Matricula VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE PlazaEstacionamiento (
    ID_Plaza INT PRIMARY KEY AUTO_INCREMENT,
    Disponible BOOLEAN DEFAULT TRUE,
    ID_Vehiculo INT,
    CONSTRAINT FK_Plaza_Vehiculo FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo (ID_Vehiculo)
);

CREATE TABLE TransaccionEstacionamiento (
    ID_Transaccion INT PRIMARY KEY AUTO_INCREMENT,
    ID_Vehiculo INT NOT NULL,
    ID_Plaza INT NOT NULL,
    FechaHoraInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FechaHoraFin DATETIME,
    MontoPagado DECIMAL(10, 2),
    CONSTRAINT FK_Transaccion_Vehiculo FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo (ID_Vehiculo),
    CONSTRAINT FK_Transaccion_Plaza FOREIGN KEY (ID_Plaza) REFERENCES PlazaEstacionamiento (ID_Plaza)
);

DROP TABLE Vehiculo;
DROP TABLE PlazaEstacionamiento;
DROP TABLE TransaccionEstacionamiento;

-- Insertar 20 registros en PlazaEstacionamiento con ID_Vehiculo como NULL
INSERT INTO PlazaEstacionamiento (Disponible, ID_Vehiculo)
SELECT TRUE, NULL
FROM information_schema.tables
LIMIT 20;

UPDATE PlazaEstacionamiento SET ID_Vehiculo = null;

USE Parking;
SELECT SUM(MontoPagado) AS SumaMontosPagados
FROM TransaccionEstacionamiento
WHERE DATE(FechaHoraInicio) = CURDATE();

SELECT PlazaEstacionamiento.Id_Plaza, PlazaEstacionamiento.Disponible, Vehiculo.Matricula, TransaccionEstacionamiento.FechaHoraInicio
                FROM PlazaEstacionamiento
                LEFT JOIN Vehiculo ON PlazaEstacionamiento.ID_Vehiculo = Vehiculo.ID_Vehiculo
                LEFT JOIN TransaccionEstacionamiento ON PlazaEstacionamiento.ID_Plaza = TransaccionEstacionamiento.ID_Plaza
                AND TransaccionEstacionamiento.FechaHoraFin IS NULL;


SELECT Vehiculo.Matricula FROM PlazaEstacionamiento
INNER JOIN Vehiculo ON PlazaEstacionamiento.ID_Vehiculo = Vehiculo.ID_Vehiculo
WHERE PlazaEstacionamiento.ID_Plaza = 20;
UPDATE PlazaEstacionamiento SET ID_Vehiculo = 2 WHERE ID_Plaza = 2;
UPDATE PlazaEstacionamiento SET ID_Vehiculo = 8 WHERE ID_Plaza = 20;
