function Base(){
	this.VertexPositionBuffer;
	this.VertexColorBuffer;
	this.VertexNormalBuffer;
	this.VertexIndexBuffer;
	this.vertices;
	this.colors;
	this.normals;
	this.vertexIndices;
	
	this.name;
}

Base.prototype.draw = function(translate, scale, rotate){
	mvPushMatrix();
	
	//Camera translation dela
	mat4.rotate(mvMatrix, degToRad(-cameraRotation[0]), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-cameraRotation[1]), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(-cameraRotation[2]), [0, 0, 1]);
	mat4.translate(mvMatrix, [-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]]);

	mat4.scale(mvMatrix, scale); //dela čudno?
	mat4.rotate(mvMatrix, degToRad(rotate[0]), [1, 0, 0]); //ne dela
	mat4.rotate(mvMatrix, degToRad(rotate[1]), [0, 1, 0]); //ne dela
	mat4.rotate(mvMatrix, degToRad(rotate[2]), [0, 0, 1]); //dela
	mat4.translate(mvMatrix, translate); // dela
		
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	  
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	  
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.VertexIndexBuffer);

	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, this.VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
	mvPopMatrix();
}