<?php
use \Psr\Http\Message\ResponseInterface as Response;
use \Psr\Http\Message\ServerRequestInterface as Request;

$app->get('/api/estadosticket', function (Request $request, Response $response) {

    $consulta = "SELECT * FROM ts_estados_ticket ";

    try {

        $db = new db();

        $db = $db->conectar();
        $ejecutar = $db->query($consulta);
        $result = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($result);
    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/estadosticket/{id}', function (Request $request, Response $response) {

    $id_ticket = $request->getAttribute('id');
    $consulta = "SELECT * FROM ts_estados_ticket WHERE idEstadoTicket = $id_ticket";

    try {
        $db = new db();
        $db = $db->conectar();

        $ejecutar = $db->query($consulta);
        $noticias = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($noticias);
    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/estadoticketorden/{orden}', function (Request $request, Response $response) {

    $orden = $request->getAttribute('orden');
    $consulta = "SELECT * FROM ts_estados_ticket WHERE orden = $orden";

    try {
        $db = new db();
        $db = $db->conectar();

        $ejecutar = $db->query($consulta);
        $noticias = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($noticias);
    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/estadosrecibidos/{idTicket}/{verificar}', function (Request $request, Response $response) {
    $id_ticket = $request->getAttribute('idTicket');

    $verificar = $request->getAttribute('verificar');

    try {

        $db = new db();
        $db = $db->conectar();

        $consulta1 = "SELECT 	esta.*
                        FROM ts_estados_ticket esta
                        INNER JOIN (SELECT *
                        FROM ts_traza_ticket_servicio
                             WHERE idTicketServicio = $id_ticket) traza ON esta.idEstadoTicket = traza.idEstadoTicket
                        ORDER BY fechaAlta DESC LIMIT 1; ";
        $ejecutar = $db->query($consulta1);
        $ultimo_estado = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        $ejecutar = null;
        $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -10";
        $ejecutar = $db->query($consulta3);
        $estados_term = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        $ejecutar = null;
        if ($verificar == 1) {
            $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = (" . $ultimo_estado[0]->orden . " + 1)";
            $ejecutar = null;
            $ejecutar = $db->query($consulta2);
            $siguientes = $ejecutar->fetchAll(PDO::FETCH_OBJ);
            echo json_encode(array_merge($siguientes, $estados_term));

        } else {
            echo json_encode($estados_term);
        }

        $db = null;

    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/verrecibidos/{idTicket}/{verificar}', function (Request $request, Response $response) {
    $id_ticket = $request->getAttribute('idTicket');

    $verificar = $request->getAttribute('verificar');

    try {

        $db = new db();
        $db = $db->conectar();

        $consulta1 = "SELECT 	esta.*
                        FROM ts_estados_ticket esta
                        INNER JOIN (SELECT *
                        FROM ts_traza_ticket_servicio
                             WHERE idTicketServicio = $id_ticket) traza ON esta.idEstadoTicket = traza.idEstadoTicket
                        ORDER BY traza.fechaAlta DESC LIMIT 1 ";
        $ejecutar = $db->query($consulta1);
        $ultimo_estado = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        $estado_actual = $ultimo_estado[0]->idEstadoTicket;
        $consulta2 = "";

        switch ($estado_actual) {
            case '1':
                $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = -10";
                $ejecutar = null;
                $ejecutar = $db->query($consulta2);
                $anular = $ejecutar->fetchAll(PDO::FETCH_OBJ);

                if ($verificar == 1) {
                    $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = (" . $ultimo_estado[0]->orden . " + 1)";
                    $ejecutar = null;
                    $ejecutar = $db->query($consulta2);
                    $siguientes = $ejecutar->fetchAll(PDO::FETCH_OBJ);
                    echo json_encode(array_merge($siguientes, $anular));
                } else {
                    echo json_encode(array_merge($anular));
                }
                break;
            case '5':
                $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = (" . $ultimo_estado[0]->orden . " + 1)";
                $ejecutar = null;
                $ejecutar = $db->query($consulta2);
                $siguientes = $ejecutar->fetchAll(PDO::FETCH_OBJ);
                echo json_encode(array_merge($siguientes));
                break;

            default:
                echo json_encode(array_merge($ultimo_estado, $siguientes));
                break;
        }

        /* $ejecutar = null;
        $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -10";
        $ejecutar = $db->query($consulta3);
        $estados_term = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        $ejecutar = null;
        if ($verificar == 1) {
        $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = (" . $ultimo_estado[0]->orden . " + 1)";
        $ejecutar = null;
        $ejecutar = $db->query($consulta2);
        $siguientes = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        echo json_encode(array_merge($siguientes, $estados_term));

        } else {
        echo json_encode($estados_term);
        }
         */
        $db = null;

    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/estadossiguientes/{idTicket}/{anular}', function (Request $request, Response $response) {
    $id_ticket = $request->getAttribute('idTicket');
    $anular = $request->getAttribute('anular');
    $verificar = $request->getAttribute('verificar');
    $consulta1 = "SELECT 	esta.*
                    FROM ts_estados_ticket esta
                    INNER JOIN (SELECT *
                                FROM ts_traza_ticket_servicio
                                WHERE idTicketServicio = $id_ticket) traza ON esta.idEstadoTicket = traza.idEstadoTicket
                    ORDER BY traza.fechaAlta DESC LIMIT 1 ";
    try {

        $db = new db();
        $db = $db->conectar();

        $ejecutar = $db->query($consulta1);
        $ultimo_estado = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        //print_r($ultimo_estado[0]->orden);
        $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = (" . $ultimo_estado[0]->orden . " + 1)";
        //print_r($consulta2);
        $ejecutar = null;
        $ejecutar = $db->query($consulta2);
        $siguientes = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        $ejecutar = null;
        if ($anular == "0") {
            $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -10";
        }

        if ($anular == "1") {
            $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -20";
        }

        $ejecutar = $db->query($consulta3);
        $estados_term = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        $db = null;

        echo json_encode(array_merge($siguientes, $estados_term));

    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/estadosactualysig/{idTicket}/{aprobado}', function (Request $request, Response $response) {
    $id_ticket = $request->getAttribute('idTicket');
    $aprobado = $request->getAttribute('aprobado');

    $consulta1 = "SELECT esta.*
                FROM ts_estados_ticket esta
                INNER JOIN (SELECT *
                            FROM ts_traza_ticket_servicio
                            WHERE idTicketServicio = $id_ticket) traza ON esta.idEstadoTicket = traza.idEstadoTicket
                ORDER BY orden DESC LIMIT 1 ";
    try {

        $db = new db();
        $db = $db->conectar();

        $ejecutar = $db->query($consulta1);
        $ultimo_estado = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        //print_r($ultimo_estado[0]->orden);
        $consulta2 = "SELECT * FROM ts_estados_ticket WHERE orden = (" . $ultimo_estado[0]->orden . " + 1)";
        //print_r($consulta2);
        $ejecutar = null;
        $ejecutar = $db->query($consulta2);
        $siguientes = $ejecutar->fetchAll(PDO::FETCH_OBJ);

        if ($aprobado == 2) {
            $ejecutar = null;
            $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -20";
            $ejecutar = $db->query($consulta3);
            $estado_rechazar = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        }

        if ($aprobado == 3) {
            $ejecutar = null;
            $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -20";
            $ejecutar = $db->query($consulta3);
            $estado_rechazar = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        }

        /* $ejecutar = null;
        if ($anular == "1") {
        $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -10";
        } else {
        $consulta3 = "SELECT * FROM ts_estados_ticket WHERE orden = -20";
        }
        $ejecutar = $db->query($consulta3);
        $estados_term =  $ejecutar->fetchAll(PDO::FETCH_OBJ);*/

        $db = null;

        //echo json_encode(array_merge($ultimo_estado,$siguientes, $estados_term));
        if ($aprobado == 0) {
            echo json_encode($siguientes);
        }
        if ($aprobado == 1) {
            echo json_encode(array_merge($ultimo_estado, $siguientes));
        }
        if ($aprobado == 2) {
            echo json_encode(array_merge($siguientes, $estado_rechazar));
        }
        if ($aprobado == 3) {
            echo json_encode(array_merge($ultimo_estado, $siguientes, $estado_rechazar));
        }

    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->get('/api/estadoshisrecibidos', function (Request $request, Response $response) {
    
    $consulta = "SELECT * FROM ts_estados_ticket
                 WHERE idEstadoTicket > 5 AND idEstadoTicket < 10";

    try {
        $db = new db();
        $db = $db->conectar();

        $ejecutar = $db->query($consulta);
        $noticias = $ejecutar->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo json_encode($noticias);
    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->put('/api/estadosticket/{id}', function (Request $request, Response $response) {

    $id = $request->getAttribute('id');

    $fechaAlta = $request->getParam('fechaAlta');
    $descripcion = $request->getParam('descripcion');
    $fechaRequerida = $request->getParam('fechaRequerida');
    $fechaEstimada = $request->getParam('fechaEstimada');
    $idEstadoActual = $request->getParam('idEstadoActual');
    $estadoActual = $request->getParam('estadoActual');
    $fechaEstadoActual = $request->getParam('fechaEstadoActual');

    $justificacionEstadoActual = $request->getParam('justificacionEstadoActual');
    $idGerenciaOrigen = $request->getParam('idGerenciaOrigen');
    $idGerenciaDestino = $request->getParam('idGerenciaDestino');
    $idSegUsuario = $request->getParam('idSegUsuario');
    $idServiciosGerencias = $request->getParam('idServiciosGerencias');

    $consulta = "UPDATE ts_estados_ticket SET
                    fechaAlta                   = :fechaAlta,
                    descripcion                 = :descripcion,
                    fechaRequerida              = :fechaRequerida,
                    fechaEstimada               = :fechaEstimada,
                    idEstadoActual              = :idEstadoActual,
                    estadoActual                = :estadoActual,
                    fechaEstadoActual           = :fechaEstadoActual,
                    justificacionEstadoActual   = :justificacionEstadoActual,
                    idGerenciaOrigen            = :idGerenciaOrigen,
                    idGerenciaDestino           = :idGerenciaDestino,
                    idSegUsuario                = :idSegUsuario,
                    idServiciosGerencias        = :idServiciosGerencias

                    WHERE idTicketServicio = :id";

    try {

        $db = new db();
        $db = $db->conectar();

        $stmt = $db->prepare($consulta);
        $stmt->bindParam(':fechaAlta', $fechaAlta);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':fechaRequerida', $fechaRequerida);
        $stmt->bindParam(':fechaEstimada', $fechaEstimada);
        $stmt->bindParam(':fechaEstimada', $fechaEstimada);
        $stmt->bindParam(':idEstadoActual', $idEstadoActual);
        $stmt->bindParam(':estadoActual', $estadoActual);
        $stmt->bindParam(':fechaEstadoActual', $fechaEstadoActual);
        $stmt->bindParam(':justificacionEstadoActual', $justificacionEstadoActual);
        $stmt->bindParam(':idGerenciaOrigen', $idGerenciaOrigen);
        $stmt->bindParam(':idGerenciaDestino', $idGerenciaDestino);
        $stmt->bindParam(':idSegUsuario', $idSegUsuario);
        $stmt->bindParam(':idServiciosGerencias', $idServiciosGerencias);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $db = null;

        echo '{"message": {"text": "Ticket actualizado correctamente"}}';

    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});

$app->delete('/api/estadosticket/{id}', function (Request $request, Response $response) {

    $id_ticket = $request->getAttribute('id');

    $consulta = "DELETE FROM ts_estados_ticket WHERE idTicketServicio = $id_ticket";

    try {

        $db = new db();
        $db = $db->conectar();

        $sentencia = $db->prepare($consulta);
        $sentencia->execute();

        $db = null;

        echo '{"message": {"text": "Noticia eliminado correctamente"}}';
    } catch (PDOException $error) {
        echo '{"error": {"text":' . $error->getMessage() . '}}';
    }
});
