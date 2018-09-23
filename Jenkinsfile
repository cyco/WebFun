pipeline {
 agent {
        docker { image 'alpine' }
    }

	stages {
		stage("Prepare") {
			steps {
				echo "Prepare environment"
			}
		}

		stage("Build") {
			steps {
				echo "Build program"
			}
		}

		stage("Test") {
			steps {
				echo "Execute Tests"
			}
		}
	}
}
