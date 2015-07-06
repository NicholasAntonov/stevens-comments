<?PHP

	/*************************************************
	**												**
    **  Class database written by Steven A. Gabarr� **
	** 												**
	*************************************************/

	class database
	{
		private $res;
		private $host = "127.0.0.1"; // change to your own default values
		private $user = "dev"; // change to your own default values
		private $pass = "dev"; // change to your own default values
		private $db = "stevens_comments"; // change to your own default values
		private $mysqli;


		// sets user, pass and host and connects
		public function setup($u, $p, $h, $db)
		{
			$this->user = $u;
			$this->pass = $p;
			$this->host = $h;
			$this->db = $db;
			if (isset($this->mysqli))
				$this->disconnect();
			$this->connect();
		}

		// Changes the database in which all queries will be performed
		public function pick_db($db)
		{
			$this->db = $db;
			if (isset($this->mysqli))
				$this->mysqli->select_db($db);
			else
				$this->connect();
		}

		// destructor disconnects and frees the results holder
		public function __destruct()
		{
			$this->disconnect();
		}

		//Closes the connection to the DB
		public function disconnect()
		{
			if (isset($this->mysqli))
				$this->mysqli->close();
			if (isset($this->res) && gettype($this->res) == "object")
			{
				$this->res->free();
			}
			unset($this->res);
			unset($this->mysqli);
		}


		// connects to the DB or disconnects/reconnects if a connection already existed
		public function connect()
		{
			if (isset($this->mysqli))
				$this->disconnect();

			try {
				if (!$this->mysqli= new mysqli($this->host, $this->user, $this->pass, $this->db))
					throw new Exception("Cannot Connect to ".$this->host);
			} catch (Exception $e)
			{
				echo $e->getMessage();
				exit;
			}
		}

        public function escape($str) {
            if (!isset($this->mysqli))
                $this->connect();
            return $this->mysqli->escape_string($str);
        }

		public function send_sql($sql) {
			if (!isset($this->mysqli))
				$this->connect();
			try {
				if (isset($this->res) && gettype($this->res) == "object")
					$this->res->free();
				if (! $this->res = $this->mysqli->query($sql))
					throw new Exception("Could not send query");
			} catch (Exception $e)
			{
				echo $e->getMessage()."<BR>";
				echo $this->mysqli->error;
				exit;
			}
			return $this->res;
		}

		// Shows the contents of the $res as a table
		public function printout() {
			if (isset($this->res) && (($this->res->num_rows) > 0))
			{
				$this->res->data_seek(0);
				$names = $this->res->fetch_fields();
				$num = count($names);
				echo "<table border=1>";
				echo "<tr>";
				for ($i=0;$i<$num;$i++){
				   echo "<th>";
				   echo $names[$i]->name;
				   echo "</th>";
				}
				echo "</tr>";
				while ($row  =  $this->res->fetch_row()) {
					echo "<tr>";
					foreach ($row as $elem) {
					   echo "<td>$elem</td>";
					}
					echo "</tr>";
				}
				echo "</table>";
				$this->res->data_seek(0);
			}
			else
				echo "There is nothing to print!<BR>";
		}

		// returns an array with the next row
		public function next_row()
		{
			if (isset($this->res)) {
                $row = $this->res->fetch_assoc();
                if (!empty($row))
                    foreach ($row as $key => $value) {
                        $row[$key] = $value;
                    }
                return $row;
            }
			echo "You need to make a query first!!!";
			return false;
		}

		// returns the last AUTO_INCREMENT data created
		public function insert_id()
		{
			if (isset($this->mysqli))
			{
				$id = $this->mysqli->insert_id;
				if ($id == 0)
					echo "You did not insert an element that causes an auto-increment ID to be created!<BR>";
				return $id;
			}
			echo "You are not connected to the database!";
			return false;
		}

		// Creates a new DB and selects it
		public function new_db($name)
		{
			if (!isset($this->mysqli))
				$this->connect();
			$query = "CREATE DATABASE IF NOT EXISTS ".$name;
			try {
				if (!$this->mysqli->query($query))
					throw new Exception("Cannot create database ".$name);
				$this->db = $name;
				$this->mysqli->select_db($name);
			} catch (Exception $e)
			{
				echo $e->getMessage()."<BR>";
				echo $this->mysqli->error;
				exit;
			}
		}
	}

?>
