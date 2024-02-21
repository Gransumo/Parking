USE Parking;

DELIMITER //
CREATE TRIGGER Car_INSIDE_PlazaEstacionamiento
BEFORE UPDATE ON PlazaEstacionamiento
FOR EACH ROW
BEGIN
    -- Verificar si ID_Vehiculo ha cambiado
    IF  OLD.ID_Vehiculo IS NULL AND NEW.ID_Vehiculo IS NOT NULL THEN
        -- Actualizar Disponible a FALSE
        SET NEW.Disponible = FALSE;
        
        -- Insertar un nuevo registro en TransaccionEstacionamiento
        INSERT INTO TransaccionEstacionamiento (ID_Vehiculo, ID_Plaza)
        VALUES (NEW.ID_Vehiculo, NEW.ID_Plaza);
    END IF;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER Car_OUTSIDE_PlazaEstacionamiento
BEFORE UPDATE ON PlazaEstacionamiento
FOR EACH ROW
BEGIN
    -- Verificar si ID_Vehiculo ha cambiado a NULL
    IF NEW.ID_Vehiculo IS NULL AND OLD.ID_Vehiculo IS NOT NULL THEN
		SET NEW.Disponible = TRUE;
        -- Actualizar registro en TransaccionEstacionamiento
        UPDATE TransaccionEstacionamiento
        SET FechaHoraFin = CURRENT_TIMESTAMP,
            MontoPagado = TIMESTAMPDIFF(MINUTE, FechaHoraInicio, CURRENT_TIMESTAMP) * 0.05
        WHERE ID_Plaza = OLD.ID_Plaza AND MontoPagado IS NULL;
    END IF;
END;
//
DELIMITER ;

